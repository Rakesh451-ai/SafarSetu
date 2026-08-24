import os
import json
import logging
from typing import Dict, Any, List, Optional
from django.conf import settings
from destinations.models import Destination
from safety.models import SafetyZone, SafetyAlert
from services.models import VerifiedService
from tourists.models import TouristProfile

logger = logging.getLogger(__name__)


class AIAssistantService:
    @staticmethod
    def get_grounding_context(user_query: str, tourist_profile: Optional[TouristProfile] = None) -> Dict[str, Any]:
        """
        Retrieves real, verified backend context to ground the AI model:
        Destinations, Safety Zones, Active Advisories, and Verified Services.
        """
        # Search relevant destinations
        destinations = Destination.objects.all()
        q_lower = user_query.lower()

        matched_destinations = []
        for dest in destinations:
            if (dest.name.lower() in q_lower or
                dest.city.lower() in q_lower or
                dest.state.lower() in q_lower or
                dest.slug in q_lower):
                matched_destinations.append(dest)

        if not matched_destinations:
            matched_destinations = list(destinations[:4])

        active_zones = list(SafetyZone.objects.filter(is_active=True)[:5])
        active_alerts = list(SafetyAlert.objects.filter(is_active=True)[:5])
        verified_services = list(VerifiedService.objects.filter(is_verified=True)[:4])

        dest_context = []
        for d in matched_destinations:
            dest_context.append(
                f"- {d.name} ({d.city}, {d.state}): Category: {d.category}, Opening Hours: {d.opening_hours}, "
                f"Entry Fee: {d.entry_fee}, Safety Rating: {d.safety_rating}/5.0, Crowd: {d.crowd_status}"
            )

        zones_context = []
        for z in active_zones:
            zones_context.append(f"- {z.name} [{z.zone_type.upper()}]: {z.description}. Advisory: {z.active_advisory}")

        alerts_context = []
        for a in active_alerts:
            alerts_context.append(f"- Alert: {a.title} ({a.location_name}) [{a.severity.upper()}]: {a.description}")

        user_info = ""
        if tourist_profile:
            user_info = f"Tourist Name: {tourist_profile.full_name}, Nationality: {tourist_profile.nationality}, Preferred Language: {tourist_profile.user.preferred_language if tourist_profile.user else 'en'}"

        return {
            "destinations_text": "\n".join(dest_context),
            "zones_text": "\n".join(zones_context),
            "alerts_text": "\n".join(alerts_context),
            "matched_destinations": matched_destinations,
            "user_info": user_info
        }

    @staticmethod
    def generate_response(user_message: str, tourist_profile: Optional[TouristProfile] = None) -> Dict[str, Any]:
        """
        Generates contextual AI response. Uses OpenAI API if configured,
        otherwise falls back cleanly to the rule-based tourism intelligence engine.
        """
        api_key = getattr(settings, 'OPENAI_API_KEY', None) or os.getenv('OPENAI_API_KEY')
        context = AIAssistantService.get_grounding_context(user_message, tourist_profile)

        # 1. Try OpenAI API if key configured
        if api_key and api_key.strip():
            try:
                import openai
                client = openai.OpenAI(api_key=api_key.strip())

                system_prompt = (
                    "You are SafarSetu AI, the official AI Tourist Guide and Safety Assistant for India.\n"
                    "Your mission is to provide safe, verified, culturally rich, and practical travel recommendations.\n"
                    "CRITICAL RULES:\n"
                    "1. Always ground your safety advice in the provided verified data. Never invent false safety clearances.\n"
                    "2. Include accurate timings, entry fees, transport advice, and safety precautions.\n"
                    "3. Format your response cleanly with bullet points and bold highlights.\n\n"
                    f"--- VERIFIED DESTINATION FACTS ---\n{context['destinations_text']}\n\n"
                    f"--- ACTIVE SAFETY ZONES ---\n{context['zones_text']}\n\n"
                    f"--- ACTIVE SAFETY ALERTS ---\n{context['alerts_text']}\n\n"
                    f"--- TOURIST CONTEXT ---\n{context['user_info']}"
                )

                response = client.chat.completions.create(
                    model="gpt-4o-mini" if "gpt" in api_key else "gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_message}
                    ],
                    max_tokens=600,
                    temperature=0.7,
                )

                reply_text = response.choices[0].message.content

                # Build cards from matched destinations
                cards = []
                for dest in context['matched_destinations'][:2]:
                    cards.append({
                        "type": "destination",
                        "title": dest.name,
                        "subtitle": f"{dest.city}, {dest.state} • Open {dest.opening_hours}",
                        "rating": dest.rating,
                        "cost": f"₹{dest.entry_fee.get('domestic', 50)}" if isinstance(dest.entry_fee, dict) else "₹50",
                        "safetyLevel": "safe" if dest.safety_rating >= 4.5 else "caution",
                        "tags": [dest.category.title(), "Verified ASI Guide"],
                        "actionLabel": "Explore Monument Guide",
                        "destinationId": dest.slug
                    })

                return {
                    "id": f"ai-{int(os.times().elapsed * 1000)}",
                    "sender": "assistant",
                    "timestamp": "Just now",
                    "text": reply_text,
                    "cards": cards if cards else None
                }

            except Exception as exc:
                logger.warning(f"OpenAI API call failed, falling back to local engine: {exc}")

        # 2. Intelligent Development Fallback
        return AIAssistantService._fallback_response(user_message, context)

    @staticmethod
    def _fallback_response(query: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Development fallback matching common travel queries."""
        lower = query.lower()
        reply: str
        cards = []

        if 'jaipur' in lower or 'rajasthan' in lower:
            reply = (
                "Namaste! 🙏 Here is your **2-Day Safe Travel Itinerary for Jaipur**:\n\n"
                "• **Day 1 (Heritage Circuit)**:\n"
                "  1. **Amber Fort & Palace** (08:30 AM – 11:30 AM) — Visit the Sheesh Mahal. RTDC electric buggies available.\n"
                "  2. **City Palace** (01:00 PM – 03:30 PM) — Royal museum and peacock courtyard.\n"
                "  3. **Hawa Mahal** (04:30 PM – 06:00 PM) — Best sunset lighting on the honeycomb facade.\n\n"
                "• **Day 2 (Forts & Cultural Bazaars)**:\n"
                "  1. **Nahargarh Fort** (Morning panoramic sunrise views).\n"
                "  2. **Jantar Mantar** (World Heritage astronomical observatory).\n"
                "  3. **Johari Bazaar** (Verified crafts & authentic lassi tasting).\n\n"
                "🛡️ **Safety Note**: All key monuments have active Rajasthan Tourist Police posts and 24x7 SOS coverage."
            )
            cards.append({
                "type": "destination",
                "title": "Amber Palace & Fort",
                "subtitle": "Amer, Jaipur • Open 08:00 AM - 05:30 PM",
                "rating": 4.8,
                "cost": "₹100 (Indian) / ₹550 (Foreigner)",
                "safetyLevel": "safe",
                "tags": ["Heritage", "Safe Corridor", "Audio Guide"],
                "actionLabel": "View Full Guide",
                "destinationId": "amber-fort"
            })
            cards.append({
                "type": "route",
                "title": "Jaipur Pink City Heritage Walk",
                "subtitle": "Hawa Mahal ➔ City Palace ➔ Jantar Mantar (1.8 km)",
                "rating": 4.9,
                "cost": "Free Walking Route",
                "safetyLevel": "safe",
                "tags": ["Safe Pedestrian", "Police Monitored"],
                "actionLabel": "View Safe Route"
            })

        elif 'agra' in lower or 'taj' in lower:
            reply = (
                "Namaste! Here are verified recommendations for **Agra & Taj Mahal**:\n\n"
                "• **Taj Mahal** (East & West Gates): Open sunrise to sunset (Closed Fridays).\n"
                "  - Book ASI e-tickets via SafarSetu to skip ticket queue.\n"
                "  - Official battery golf carts run between Shilpgram parking and the monument gates (₹10).\n"
                "• **Agra Fort**: Just 2.5 km from Taj Mahal, sprawling red sandstone Mughal residence.\n"
                "• **Mehtab Bagh**: Spectacular sunset viewpoint across the Yamuna River.\n\n"
                "🛡️ **Safety Advisory**: Avoid unverified street vendors claiming VIP entry skips. Only hire ASI badge-holding guides."
            )
            cards.append({
                "type": "destination",
                "title": "Taj Mahal",
                "subtitle": "Agra, Uttar Pradesh • 🟢 Safe Heritage Zone",
                "rating": 4.9,
                "cost": "₹50 (Indian) / ₹1100 (Foreigner)",
                "safetyLevel": "safe",
                "tags": ["UNESCO Wonder", "Tourist Police 1363"],
                "actionLabel": "Explore Audio Guide",
                "destinationId": "taj-mahal"
            })

        elif 'safe' in lower or 'route' in lower or 'safety' in lower:
            reply = (
                "🛡️ **SafarSetu Real-Time Route & Safety Advisory**:\n\n"
                "• **Delhi to Jaipur**: Safest transit is via the **Delhi-Mumbai Expressway (NE4)** or **Vande Bharat Express Train**.\n"
                "• **Delhi to Agra**: Use the **Yamuna Expressway** or **Gatimaan Express (90 mins)**.\n"
                "• **Emergency Help**: Press the red **SOS Button** anytime to broadcast your GPS coordinates to Tourist Police (1363) and your registered emergency contacts."
            )
            cards.append({
                "type": "safety",
                "title": "24x7 Tourist Police & Emergency Dispatch",
                "subtitle": "Helpline 1363 / National Emergency 112",
                "rating": 5.0,
                "safetyLevel": "safe",
                "tags": ["Verified Police", "Emergency SOS"],
                "actionLabel": "View Safety Center"
            })

        elif 'budget' in lower or 'cost' in lower:
            reply = (
                "💡 **Verified Budget Travel Tips for India**:\n\n"
                "• **Monument Tickets**: Book government ASI passes online for standard ₹50 domestic entry.\n"
                "• **Local Transit**: Use official prepaid taxi/auto booths at railway stations or metro cards (Delhi/Jaipur Metro).\n"
                "• **Guides**: Hire official state-licensed guides (averaging ₹1500–₹2200 per half-day) with verified QR badges on SafarSetu."
            )
            cards.append({
                "type": "budget",
                "title": "Official ASI E-Passes & Guides",
                "subtitle": "Save up to 40% over unauthorized middle-men",
                "rating": 4.9,
                "cost": "Fixed Govt Rates",
                "safetyLevel": "safe",
                "tags": ["Govt Tariff", "No Hidden Charges"],
                "actionLabel": "View Services"
            })

        else:
            matched_dest = context['matched_destinations'][0] if context['matched_destinations'] else None
            reply = (
                f"Namaste! 🙏 I am **SafarSetu AI**, your verified travel assistant for India.\n\n"
                f"Regarding **'{query}'**, all destinations on SafarSetu are verified by tourism authorities and monitored with geo-safety zones.\n\n"
                "Feel free to ask for:\n"
                "• Customized day-by-day itineraries\n"
                "• Monument timings & entry fees\n"
                "• Safe transit routes & audio guides\n"
                "• Nearby police assistance & verified hotels"
            )
            if matched_dest:
                cards.append({
                    "type": "destination",
                    "title": matched_dest.name,
                    "subtitle": f"{matched_dest.city}, {matched_dest.state} • Rating {matched_dest.rating}★",
                    "rating": matched_dest.rating,
                    "cost": f"₹{matched_dest.entry_fee.get('domestic', 50)}" if isinstance(matched_dest.entry_fee, dict) else "₹50",
                    "safetyLevel": "safe",
                    "tags": [matched_dest.category.title(), "Verified"],
                    "actionLabel": "View Details",
                    "destinationId": matched_dest.slug
                })

        return {
            "id": f"ai-fallback-{int(os.times().elapsed * 1000)}",
            "sender": "assistant",
            "timestamp": "Just now",
            "text": reply,
            "cards": cards if cards else None
        }
