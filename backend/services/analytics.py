from core.connection import get_db_cursor

# Saves one analytics event for a message.
def save_analytics_event(message_id, event_type):
    with get_db_cursor(commit=True) as cur:
        cur.execute(
            """
            SELECT project_id
            FROM messages
            WHERE message_id = %s
            """,
            (message_id,)
        )

        result = cur.fetchone()

        if result is None:
            return False

        project_id = result[0]

        cur.execute(
            """
            INSERT INTO analytics_events (message_id, event_type)
            VALUES (%s, %s)
            """,
            (message_id, event_type)
        )

        if event_type == "VIEW":
            column_name = "views"
        elif event_type == "CLICK":
            column_name = "clicks"
        elif event_type == "DISMISS":
            column_name = "dismisses"
        else:
            return False

        cur.execute(
            f"""
            INSERT INTO message_analytics_summary (message_id, {column_name})
            VALUES (%s, 1)
            ON CONFLICT (message_id)
            DO UPDATE SET {column_name} = message_analytics_summary.{column_name} + 1
            """,
            (message_id,)
        )

        cur.execute(
            f"""
            INSERT INTO project_analytics_summary (project_id, {column_name})
            VALUES (%s, 1)
            ON CONFLICT (project_id)
            DO UPDATE SET {column_name} = project_analytics_summary.{column_name} + 1
            """,
            (project_id,)
        )

    return True

# Returns view, click, dismiss, and CTR counts for one message.
def get_analytics_summary(message_id):
    with get_db_cursor() as cur:
        cur.execute(
            """
            SELECT views, clicks, dismisses
            FROM message_analytics_summary
            WHERE message_id = %s
            """,
            (message_id,)
        )

        result = cur.fetchone()

    if result is None:
        views = 0
        clicks = 0
        dismisses = 0
    else:
        views = result[0]
        clicks = result[1]
        dismisses = result[2]

    ctr = 0
    if views > 0:
        ctr = (clicks / views) * 100

    return {
        "message_id": message_id,
        "views": views,
        "clicks": clicks,
        "dismisses": dismisses,
        "ctr": ctr
    }

# Returns total analytics counts for all messages in a project.
def get_project_analytics_summary(project_id):
    with get_db_cursor() as cur:
        cur.execute(
            """
            SELECT views, clicks, dismisses
            FROM project_analytics_summary
            WHERE project_id = %s
            """,
            (project_id,)
        )

        result = cur.fetchone()

    if result is None:
        views = 0
        clicks = 0
        dismisses = 0
    else:
        views = result[0]
        clicks = result[1]
        dismisses = result[2]

    return {
        "project_id": project_id,
        "views": views,
        "clicks": clicks,
        "dismisses": dismisses
    }

# Returns the top 5 project messages ordered by click-through rate.
def get_top_messages_by_ctr(project_id):
    with get_db_cursor() as cur:
        cur.execute(
            """
            SELECT
                m.message_id,
                m.title,
                COALESCE(s.views, 0) AS views,
                COALESCE(s.clicks, 0) AS clicks,
                CASE
                    WHEN COALESCE(s.views, 0) = 0 THEN 0
                    ELSE (COALESCE(s.clicks, 0)::float / s.views) * 100
                END AS ctr
            FROM messages m
            LEFT JOIN message_analytics_summary s
                ON m.message_id = s.message_id
            WHERE m.project_id = %s
            ORDER BY ctr DESC
            LIMIT 5
            """,
            (project_id,)
        )

        results = cur.fetchall()

    messages = []

    for row in results:
        messages.append({
            "message_id": row[0],
            "title": row[1],
            "views": row[2],
            "clicks": row[3],
            "ctr": row[4]
        })

    return messages

# Returns daily CTR data points for a project.
def get_project_ctr_over_time(project_id):
    with get_db_cursor() as cur:
        cur.execute(
            """
            SELECT
                DATE(ae.event_timestamp) AS event_date,
                COUNT(*) FILTER (WHERE ae.event_type = 'VIEW') AS views,
                COUNT(*) FILTER (WHERE ae.event_type = 'CLICK') AS clicks,
                CASE
                    WHEN COUNT(*) FILTER (WHERE ae.event_type = 'VIEW') = 0 THEN 0
                    ELSE
                        (
                            COUNT(*) FILTER (WHERE ae.event_type = 'CLICK')::float
                            / COUNT(*) FILTER (WHERE ae.event_type = 'VIEW')
                        ) * 100
                END AS ctr
            FROM analytics_events ae
            JOIN messages m ON ae.message_id = m.message_id
            WHERE m.project_id = %s
            GROUP BY DATE(ae.event_timestamp)
            ORDER BY event_date ASC
            """,
            (project_id,)
        )

        results = cur.fetchall()

    points = []

    for row in results:
        points.append({
            "date": row[0].isoformat(),
            "views": row[1],
            "clicks": row[2],
            "ctr": row[3]
        })

    return points
