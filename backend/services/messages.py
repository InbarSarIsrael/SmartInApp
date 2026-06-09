from datetime import datetime

from core.connection import get_db_cursor

# Inserts a new in-app message and returns its id.
def create_message(request):
    with get_db_cursor(commit=True) as cur:
        cur.execute(
            """
            INSERT INTO messages (
                project_id, title, content, type, placement, button_text, action_target, target_audience, start_date, end_date
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING message_id
            """,
            (
                request.project_id,
                request.title,
                request.content,
                request.type,
                request.placement,
                request.button_text,
                request.action_target,
                request.target_audience,
                request.start_date,
                request.end_date
            )
        )

        new_message_id = cur.fetchone()[0]

    return new_message_id

# Updates only the message fields that were sent in the request.
def update_message(message_id, request):
    update_fields = []
    values = []

    if request.title is not None:
        update_fields.append("title = %s")
        values.append(request.title)

    if request.content is not None:
        update_fields.append("content = %s")
        values.append(request.content)

    if request.type is not None:
        update_fields.append("type = %s")
        values.append(request.type)

    if request.placement is not None:
        update_fields.append("placement = %s")
        values.append(request.placement)

    if request.button_text is not None:
        update_fields.append("button_text = %s")
        values.append(request.button_text)

    if request.action_target is not None:
        update_fields.append("action_target = %s")
        values.append(request.action_target)

    if request.target_audience is not None:
        update_fields.append("target_audience = %s")
        values.append(request.target_audience)

    if request.enabled is not None:
        update_fields.append("enabled = %s")
        values.append(request.enabled)

    if request.start_date is not None:
        update_fields.append("start_date = %s")
        values.append(request.start_date)

    if request.end_date is not None:
        update_fields.append("end_date = %s")
        values.append(request.end_date)

    if not update_fields:
        return None

    update_fields.append("updated_at = CURRENT_TIMESTAMP")

    query = f"""
        UPDATE messages
        SET {', '.join(update_fields)}
        WHERE message_id = %s
        RETURNING message_id
    """

    values.append(message_id)

    with get_db_cursor(commit=True) as cur:
        cur.execute(query, values)
        updated_message = cur.fetchone()

    return updated_message

# Enables or disables a message.
def update_message_enabled(message_id, enabled):
    with get_db_cursor(commit=True) as cur:
        cur.execute(
            """
            UPDATE messages
            SET enabled = %s,
                updated_at = CURRENT_TIMESTAMP
            WHERE message_id = %s
            RETURNING message_id
            """,
            (enabled, message_id)
        )

        updated_message = cur.fetchone()

    return updated_message

# Deletes a message by id.
def delete_message(message_id):
    with get_db_cursor(commit=True) as cur:
        cur.execute(
            """
            DELETE FROM messages
            WHERE message_id = %s
            RETURNING message_id
            """,
            (message_id,)
        )

        deleted_message = cur.fetchone()

    return deleted_message


# Returns active messages for a project, optionally filtered by placement.
def get_messages_by_project(project_id, placement=None):
    query = """
        SELECT
            message_id, title, content, type, placement, button_text, action_target, target_audience
        FROM messages
        WHERE project_id = %s
        AND enabled = TRUE
        AND (start_date IS NULL OR start_date <= CURRENT_TIMESTAMP)
        AND (end_date IS NULL OR end_date >= CURRENT_TIMESTAMP)
    """

    values = [project_id]

    if placement is not None and placement.strip() != "":
        query += " AND placement = %s"
        values.append(placement)

    with get_db_cursor() as cursor:
        cursor.execute(query, values)
        messages = cursor.fetchall()

    messages_list = []

    for message in messages:
        messages_list.append({
            "message_id": message[0],
            "title": message[1],
            "content": message[2],
            "type": message[3],
            "placement": message[4],
            "button_text": message[5],
            "action_target": message[6],
            "target_audience": message[7]
        })

    return messages_list

# Calculates the display status of a message.
def get_message_status(enabled, start_date, end_date):
    now = datetime.now()

    if not enabled:
        return "DISABLED"

    if start_date is not None and start_date > now:
        return "FUTURE"

    if end_date is not None and end_date < now:
        return "EXPIRED"

    return "ACTIVE"

# Returns all project messages for the portal, including status.
def get_all_messages_by_project(project_id):
    with get_db_cursor() as cursor:
        cursor.execute(
            """
            SELECT
                message_id, title, content, type, placement,
                button_text, action_target, target_audience, enabled, start_date, end_date
            FROM messages
            WHERE project_id = %s
            ORDER BY message_id DESC
            """,
            (project_id,)
        )

        messages = cursor.fetchall()

    messages_list = []

    for message in messages:
        status = get_message_status(
            message[8],
            message[9],
            message[10]
        )
        messages_list.append({
            "message_id": message[0],
            "title": message[1],
            "content": message[2],
            "type": message[3],
            "placement": message[4],
            "button_text": message[5],
            "action_target": message[6],
            "target_audience": message[7],
            "enabled": message[8],
            "start_date": message[9],
            "end_date": message[10],
            "status": status
        })

    return messages_list

# Counts messages by status for a project.
def get_project_messages_status_summary(project_id):
    messages = get_all_messages_by_project(project_id)

    active = 0
    future = 0
    disabled = 0
    expired = 0

    for message in messages:
        if message["status"] == "ACTIVE":
            active += 1
        elif message["status"] == "FUTURE":
            future += 1
        elif message["status"] == "DISABLED":
            disabled += 1
        elif message["status"] == "EXPIRED":
            expired += 1

    return {
        "project_id": project_id,
        "active": active,
        "future": future,
        "disabled": disabled,
        "expired": expired
    }
