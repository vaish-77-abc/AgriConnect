from app.database.database import SessionLocal, engine, Base
from app.models.models import User, UserRole, FarmerProfile, WorkerProfile, Job, JobStatus, WorkType, Application, ApplicationStatus, Notification, NotificationType
from app.core.security import hash_password
from datetime import datetime, timedelta

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if data already seeded
    if db.query(User).filter(User.email == "farmer.ramesh@agriconnect.com").first():
        print("Database already contains seed data.")
        db.close()
        return

    print("Seeding AgriConnect database with sample agricultural users, jobs and profiles...")

    # 1. Create Demo Farmer
    farmer1 = User(
        email="farmer.ramesh@agriconnect.com",
        hashed_password=hash_password("farmer123"),
        name="Ramesh Patil",
        role=UserRole.FARMER,
        phone="9822012345",
        location_string="Shirur, Pune District, Maharashtra",
        location_lat=18.8256,
        location_lon=74.3789,
        avg_rating=4.9,
        total_reviews=12,
    )
    db.add(farmer1)
    db.commit()
    db.refresh(farmer1)

    farmer_profile = FarmerProfile(
        user_id=farmer1.id,
        farm_name="Patil Agro Farms & Orchards",
        farm_size="25 acres",
        crops_grown="Sugarcane, Wheat, Pomegranate, Onion",
        farm_address="Shirur, Pune District, Maharashtra",
        farm_description="Practicing mixed agriculture and horticulture for over 18 years. We provide free midday meals and tea for all farm workers.",
    )
    db.add(farmer_profile)

    # 2. Create Demo Worker
    worker1 = User(
        email="worker.santosh@agriconnect.com",
        hashed_password=hash_password("worker123"),
        name="Santosh Shinde",
        role=UserRole.WORKER,
        phone="9765432109",
        location_string="Talegaon Dhamdhere, Pune",
        location_lat=18.6756,
        location_lon=74.1500,
        avg_rating=4.9,
        total_reviews=8,
    )
    db.add(worker1)
    db.commit()
    db.refresh(worker1)

    worker_profile1 = WorkerProfile(
        user_id=worker1.id,
        skills=["Wheat Harvesting", "Tractor Driving", "Sugarcane Cutting", "Drip Irrigation"],
        experience_years=7,
        daily_wage_expectation=650.0,
        experience_description="Experienced farm crew leader with team of 6 skilled laborers. Expert in modern harvesters and manual reaping.",
    )
    db.add(worker_profile1)

    # 3. Create Additional Worker
    worker2 = User(
        email="worker.kiran@agriconnect.com",
        hashed_password=hash_password("worker123"),
        name="Kiran Jadhav",
        role=UserRole.WORKER,
        phone="9123456780",
        location_string="Manchar, Pune",
        location_lat=19.0064,
        location_lon=73.9431,
        avg_rating=4.8,
        total_reviews=5,
    )
    db.add(worker2)
    db.commit()
    db.refresh(worker2)

    worker_profile2 = WorkerProfile(
        user_id=worker2.id,
        skills=["Pesticide Spraying", "Vegetable Planting", "Weeding"],
        experience_years=4,
        daily_wage_expectation=550.0,
        experience_description="Punctual and hardworking. Experienced with motorized backpack sprayers and greenhouse maintenance.",
    )
    db.add(worker_profile2)

    # 4. Create Sample Farm Jobs
    now = datetime.now()
    job1 = Job(
        farmer_id=farmer1.id,
        title="Wheat Crop Harvesting & Threshing Crew",
        description="Looking for 5 experienced workers for 4-acre wheat reaping and bagging. Sickles and bags provided on site. Free lunch provided.",
        work_type=WorkType.HARVESTING,
        wage=650.0,
        wage_type="per_day",
        location_string="Patil Farms, Shirur, Pune",
        location_lat=18.8256,
        location_lon=74.3789,
        workers_needed=5,
        start_date=(now + timedelta(days=2)).strftime("%Y-%m-%d"),
        additional_requirements="Prior wheat reaping experience preferred.",
        status=JobStatus.OPEN,
    )
    db.add(job1)

    job2 = Job(
        farmer_id=farmer1.id,
        title="Drip Irrigation Line Laying & Filter Setup",
        description="Need 2 workers to lay sub-main lines and drip emitters across 8 acres of pomegranate orchard.",
        work_type=WorkType.IRRIGATION,
        wage=700.0,
        wage_type="per_day",
        location_string="Shirur Agricultural Belt, Pune",
        location_lat=18.8300,
        location_lon=74.3800,
        workers_needed=2,
        start_date=(now + timedelta(days=4)).strftime("%Y-%m-%d"),
        additional_requirements="Familiarity with 16mm drip lateral fittings.",
        status=JobStatus.OPEN,
    )
    db.add(job2)

    job3 = Job(
        farmer_id=farmer1.id,
        title="Sugarcane Sowing & Furrow Preparation",
        description="Assistance needed for sett cutting and furrow placement for fresh cane plantation.",
        work_type=WorkType.PLANTING,
        wage=600.0,
        wage_type="per_day",
        location_string="Khed-Manchar Border, Pune",
        location_lat=18.9500,
        location_lon=74.1200,
        workers_needed=4,
        start_date=(now + timedelta(days=7)).strftime("%Y-%m-%d"),
        additional_requirements="Hardworking and punctual.",
        status=JobStatus.OPEN,
    )
    db.add(job3)
    db.commit()
    db.refresh(job1)

    # 5. Create Sample Application from Worker1 to Job1
    app1 = Application(
        job_id=job1.id,
        worker_id=worker1.id,
        cover_note="I have a team of 4 experienced wheat reapers ready to start immediately.",
        status=ApplicationStatus.PENDING,
    )
    db.add(app1)

    # 6. Create Initial Notification for Farmer
    notif1 = Notification(
        user_id=farmer1.id,
        title="New Worker Application Received",
        message=f"{worker1.name} applied for your job 'Wheat Crop Harvesting & Threshing Crew'.",
        type=NotificationType.APPLICATION_RECEIVED,
        is_read=False,
    )
    db.add(notif1)

    db.commit()
    db.close()
    print("Seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
