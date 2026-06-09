import secrets

from core.connection import get_db_cursor


# Creates a new project and generates its API key.
def create_project(project_name):
    api_key = f"pk_{secrets.token_hex(16)}"

    with get_db_cursor(commit=True) as cursor:
        cursor.execute(
            """
            INSERT INTO projects (
                project_name, api_key
            )
            VALUES (%s, %s)
            RETURNING project_id
            """,
            (project_name, api_key)
        )

        project_id = cursor.fetchone()[0]

    return {
        "project_id": project_id,
        "project_name": project_name,
        "api_key": api_key
    }

# Finds a project by its API key.
def get_project_by_api_key(api_key):
    with get_db_cursor() as cursor:
        cursor.execute(
            """
            SELECT project_id, project_name
            FROM projects
            WHERE api_key = %s
            """,
            (api_key,)
        )

        project = cursor.fetchone()

    return project
