package com.smartinapp.sdk.network

data class PortalLoginResponse(
    val status: String,
    val project: ProjectDto
)

data class ProjectDto(
    val project_id: Int,
    val project_name: String
)