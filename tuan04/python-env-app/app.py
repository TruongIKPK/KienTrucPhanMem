import os

env = os.getenv("APP_ENV", "not set")

print(f"App is running in: {env}")