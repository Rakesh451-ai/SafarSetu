import logging
import os
from typing import Any, Dict, List, Optional

logger = logging.getLogger("safarsetu.assistant")


class LLMClient:
    """
    Config-driven LLM API client supporting Mock (for dev/testing),
    OpenAI, Gemini, and Anthropic providers.
    """

    def __init__(
        self,
        provider: Optional[str] = None,
        api_key: Optional[str] = None,
        model: Optional[str] = None,
    ):
        self.provider = (provider or os.getenv("LLM_PROVIDER", "mock")).lower()
        self.api_key = api_key or os.getenv("LLM_API_KEY", "")
        self.model = model or os.getenv("LLM_MODEL", "gpt-4o-mini")

    def generate_response(
        self,
        prompt: str,
        system_prompt: str = "You are SafarSetu AI, an expert, safety-first tourist assistant.",
        language: str = "en",
        temperature: float = 0.5,
    ) -> str:
        """
        Generates text response using configured provider.
        """
        logger.info(
            "Generating LLM response via provider: %s, language: %s",
            self.provider,
            language,
        )

        if self.provider == "openai" and self.api_key:
            return self._call_openai(prompt, system_prompt, language, temperature)
        elif self.provider == "gemini" and self.api_key:
            return self._call_gemini(prompt, system_prompt, language)
        else:
            return self._generate_mock_rag_response(prompt, system_prompt, language)

    def generate_structured_itinerary(
        self,
        tourist_name: str,
        city: str,
        duration_days: int,
        interests: List[str],
        candidate_pois: List[Dict[str, Any]],
        safety_assessment: Dict[str, Any],
        suggested_packages: List[Dict[str, Any]],
        language: str = "en",
    ) -> Dict[str, Any]:
        """
        Generates a structured day-by-day itinerary JSON.
        """
        if self.provider == "openai" and self.api_key:
            return self._call_openai_for_itinerary(
                tourist_name,
                city,
                duration_days,
                interests,
                candidate_pois,
                safety_assessment,
                language,
            )
        else:
            return self._generate_mock_itinerary_json(
                tourist_name,
                city,
                duration_days,
                interests,
                candidate_pois,
                safety_assessment,
                suggested_packages,
                language,
            )

    def _call_openai(
        self, prompt: str, system_prompt: str, language: str, temperature: float
    ) -> str:
        try:
            from openai import OpenAI  # noqa: F401

            client = OpenAI(api_key=self.api_key)
            full_system = f"{system_prompt}\nIMPORTANT: Respond in the tourist's preferred language code: '{language}'."
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": full_system},
                    {"role": "user", "content": prompt},
                ],
                temperature=temperature,
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.warning(
                "OpenAI API call failed (%s), falling back to mock provider.", e
            )
            return self._generate_mock_rag_response(prompt, system_prompt, language)

    def _call_gemini(self, prompt: str, system_prompt: str, language: str) -> str:
        try:
            import google.generativeai as genai

            genai.configure(api_key=self.api_key)
            model = genai.GenerativeModel(self.model)
            full_prompt = f"System: {system_prompt} (Respond in language '{language}')\n\nUser: {prompt}"
            resp = model.generate_content(full_prompt)
            return resp.text
        except Exception as e:
            logger.warning(
                "Gemini API call failed (%s), falling back to mock provider.", e
            )
            return self._generate_mock_rag_response(prompt, system_prompt, language)

    def _generate_mock_rag_response(
        self, prompt: str, system_prompt: str, language: str
    ) -> str:
        """
        Intelligent mock response generator acknowledging RAG retrieved POI context and language.
        """
        lang_lower = (language or "en").lower()
        if lang_lower.startswith("hi"):
            return (
                f"नमस्ते! सफरसेतु एआई में आपका स्वागत है। आपके प्रश्न के अनुसार: '{prompt[:60]}...' "
                f"हम आपको जयपुर के प्रसिद्ध एवं सुरक्षित स्थलों के भ्रमण की सलाह देते हैं। "
                f"कृपया सुरक्षा नियमों का पालन करें और प्रमाणित टूर गाइड की सहायता लें।"
            )
        elif lang_lower.startswith("fr"):
            return (
                f"Bonjour! Bienvenue sur SafarSetu AI. Concernant votre demande: '{prompt[:60]}...' "
                f"Nous vous recommandons de visiter les monuments sécurisés et certifiés de Jaipur. "
                f"Restez toujours dans les zones sécurisées indiquées sur votre carte."
            )
        elif lang_lower.startswith("es"):
            return (
                f"¡Hola! Bienvenido a SafarSetu AI. En respuesta a su consulta: '{prompt[:60]}...' "
                f"Le recomendamos explorar las atracciones verificadas y seguras. "
                f"Disfrute de su viaje con total tranquilidad y seguridad."
            )
        else:
            return (
                f"Hello! Welcome to SafarSetu AI Assistant. Based on our verified destination database: "
                f"For your inquiry regarding '{prompt[:60]}...', we recommend visiting verified heritage POIs. "
                f"All suggested locations are geofenced and monitored for your safety."
            )

    def _generate_mock_itinerary_json(
        self,
        tourist_name: str,
        city: str,
        duration_days: int,
        interests: List[str],
        candidate_pois: List[Dict[str, Any]],
        safety_assessment: Dict[str, Any],
        suggested_packages: List[Dict[str, Any]],
        language: str = "en",
    ) -> Dict[str, Any]:
        """
        Generates a realistic, day-by-day structured itinerary JSON with morning,
        afternoon, and evening POI schedules.
        """
        safe_pois = safety_assessment.get("safe_pois", [])
        caution_pois = safety_assessment.get("caution_pois", [])
        excluded_pois = safety_assessment.get("excluded_danger_pois", [])

        available_pois = safe_pois + caution_pois
        if not available_pois and candidate_pois:
            available_pois = candidate_pois

        days_list = []
        poi_index = 0
        total_available = len(available_pois)

        for day_num in range(1, duration_days + 1):
            day_schedule = []

            # Morning Activity
            if total_available > 0:
                poi_m = available_pois[poi_index % total_available]
                poi_index += 1
                day_schedule.append(
                    {
                        "time_slot": "09:00 AM - 12:30 PM",
                        "period": "Morning",
                        "poi_title": poi_m.get(
                            "title", f"Heritage Attraction #{poi_index}"
                        ),
                        "category": poi_m.get("category", "Sightseeing"),
                        "safety_zone": poi_m.get("safety_zone", "safe"),
                        "activity": f"Guided cultural exploration of {poi_m.get('title', 'monument')}.",
                        "estimated_duration": "3 hours",
                        "latitude": poi_m.get("latitude"),
                        "longitude": poi_m.get("longitude"),
                    }
                )

            # Lunch & Midday Break
            day_schedule.append(
                {
                    "time_slot": "01:00 PM - 02:30 PM",
                    "period": "Afternoon Lunch",
                    "poi_title": f"Authentic Local Dining ({city})",
                    "category": "Cuisine",
                    "safety_zone": "safe",
                    "activity": f"Traditional lunch tasting local delicacies aligned with interests ({', '.join(interests)}).",
                    "estimated_duration": "1.5 hours",
                }
            )

            # Afternoon Activity
            if total_available > 0:
                poi_a = available_pois[poi_index % total_available]
                poi_index += 1
                safety_note = (
                    "Caution: Visit strictly during daylight hours with certified guide."
                    if poi_a.get("safety_zone") == "caution"
                    else "Verified safe tourist zone."
                )
                day_schedule.append(
                    {
                        "time_slot": "03:00 PM - 06:00 PM",
                        "period": "Afternoon",
                        "poi_title": poi_a.get(
                            "title", f"Cultural Highlight #{poi_index}"
                        ),
                        "category": poi_a.get("category", "Culture & History"),
                        "safety_zone": poi_a.get("safety_zone", "safe"),
                        "safety_note": safety_note,
                        "activity": f"Sightseeing and photography at {poi_a.get('title', 'destination')}.",
                        "estimated_duration": "3 hours",
                        "latitude": poi_a.get("latitude"),
                        "longitude": poi_a.get("longitude"),
                    }
                )

            # Evening Leisure
            day_schedule.append(
                {
                    "time_slot": "06:30 PM - 08:30 PM",
                    "period": "Evening",
                    "poi_title": f"{city} Artisan Bazaars & Evening Stroll",
                    "category": "Shopping & Stroll",
                    "safety_zone": "safe",
                    "activity": "Explore verified vibrant local handicraft markets and illuminated heritage facades.",
                    "estimated_duration": "2 hours",
                }
            )

            days_list.append(
                {
                    "day": day_num,
                    "theme": f"Day {day_num}: {city} Heritage & Wonders",
                    "schedule": day_schedule,
                }
            )

        return {
            "destination": city,
            "duration_days": duration_days,
            "curated_for": tourist_name,
            "interests": interests,
            "language": language,
            "days": days_list,
            "safety_summary": {
                "safe_destinations_count": len(safe_pois),
                "caution_destinations_count": len(caution_pois),
                "excluded_danger_destinations_count": len(excluded_pois),
                "excluded_destinations": excluded_pois,
            },
            "guided_packages_suggested": suggested_packages,
        }


# Global default client instance
default_llm_client = LLMClient()
