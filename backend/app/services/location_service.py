import math


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great-circle distance between two points on Earth
    using the Haversine formula.

    Returns distance in kilometers.
    """
    R = 6371  # Earth's radius in kilometers

    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)

    a = (math.sin(delta_lat / 2) ** 2 +
         math.cos(lat1_rad) * math.cos(lat2_rad) *
         math.sin(delta_lon / 2) ** 2)

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return round(R * c, 1)


def sort_jobs_by_distance(jobs: list, user_lat: float, user_lon: float) -> list:
    """
    Sort a list of job objects by distance from the user's location.
    Each job must have location_lat and location_lon attributes.
    Returns jobs sorted closest-first with distance_km attached.
    """
    for job in jobs:
        if job.location_lat and job.location_lon:
            job.distance_km = haversine_distance(
                user_lat, user_lon,
                job.location_lat, job.location_lon
            )
        else:
            job.distance_km = None

    # Sort: jobs with distance first (closest), then jobs without location
    return sorted(jobs, key=lambda j: j.distance_km if j.distance_km is not None else float('inf'))


def filter_jobs_by_radius(jobs: list, user_lat: float, user_lon: float, radius_km: int) -> list:
    """Filter jobs to only those within the given radius from user."""
    filtered = []
    for job in jobs:
        if job.location_lat and job.location_lon:
            distance = haversine_distance(
                user_lat, user_lon,
                job.location_lat, job.location_lon
            )
            job.distance_km = distance
            if distance <= radius_km:
                filtered.append(job)
        else:
            # Include jobs without location data
            job.distance_km = None
            filtered.append(job)
    return filtered
