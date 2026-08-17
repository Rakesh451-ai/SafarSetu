import logging
from typing import List, Optional

from django.db import connection
from django.db.models import Q, QuerySet

from apps.listings.models import Listing

logger = logging.getLogger("safarsetu.assistant")


def retrieve_pois_for_query(
    query_text: str,
    city: Optional[str] = None,
    limit: int = 5,
) -> QuerySet[Listing]:
    """
    RAG Retrieval Layer:
    Executes Postgres Full-Text Search when on PostgreSQL,
    or case-insensitive ranked keyword search on SQLite dev fallback.
    """
    queryset = Listing.objects.filter(is_active=True).select_related("category")
    if city:
        queryset = queryset.filter(city__iexact=city)

    clean_query = (query_text or "").strip()
    if not clean_query:
        return queryset[:limit]

    # Check if PostgreSQL full-text search is supported on active DB connection
    is_postgres = "postgresql" in connection.vendor

    if is_postgres:
        try:
            from django.contrib.postgres.search import (
                SearchQuery,
                SearchRank,
                SearchVector,
            )

            vector = (
                SearchVector("title", weight="A")
                + SearchVector("description", weight="B")
                + SearchVector("address", weight="C")
                + SearchVector("category__name", weight="B")
            )
            query = SearchQuery(clean_query)
            ranked_qs = (
                queryset.annotate(rank=SearchRank(vector, query))
                .filter(rank__gte=0.05)
                .order_by("-rank", "-rating")
            )
            if ranked_qs.exists():
                return ranked_qs[:limit]
        except Exception as e:
            logger.warning(
                "Postgres Full-Text Search failed (%s), falling back to keyword search.",
                e,
            )

    # Fallback keyword search for dev/testing/SQLite
    keywords = [w for w in clean_query.split() if len(w) > 2]
    if not keywords:
        keywords = [clean_query]

    q_filter = Q()
    for kw in keywords:
        q_filter |= (
            Q(title__icontains=kw)
            | Q(description__icontains=kw)
            | Q(address__icontains=kw)
            | Q(category__name__icontains=kw)
        )

    results = queryset.filter(q_filter).order_by("-rating", "-created_at")[:limit]
    if not results.exists():
        # Return top rated listings if no specific keyword match
        return queryset.order_by("-rating")[:limit]

    return results


def retrieve_pois_by_interests(
    interests: List[str],
    city: str = "Jaipur",
    limit: int = 15,
) -> List[Listing]:
    """
    Retrieves candidate POIs matching a list of tourist interests.
    """
    queryset = Listing.objects.filter(is_active=True).select_related("category")
    if city:
        queryset = queryset.filter(city__iexact=city)

    if not interests:
        return list(queryset.order_by("-rating")[:limit])

    q_filter = Q()
    for interest in interests:
        clean_item = interest.strip()
        if clean_item:
            q_filter |= (
                Q(title__icontains=clean_item)
                | Q(description__icontains=clean_item)
                | Q(category__name__icontains=clean_item)
            )

    matched = list(queryset.filter(q_filter).order_by("-rating")[:limit])
    if len(matched) < limit:
        # Fill remaining slots with general top-rated POIs in destination city
        existing_ids = {poi.id for poi in matched}
        additional = list(
            queryset.exclude(id__in=existing_ids).order_by("-rating")[
                : limit - len(matched)
            ]
        )
        matched.extend(additional)

    return matched
