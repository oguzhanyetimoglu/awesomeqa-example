"""
main.py - Ticket Management API

This module provides a FastAPI-based REST API for managing tickets. It allows moderators 
to view and interact with tickets, including retrieving ticket information, marking 
tickets as resolved, and removing tickets.

Endpoints:
- GET /healthz: Returns a simple health check response to ensure the API is running.
- GET /tickets: Retrieve a list of tickets with optional limit parameter.
- PUT /tickets/{ticket_id}/resolve: Mark a ticket as resolved.
- DELETE /tickets/{ticket_id}: Remove a ticket from the list of active tickets.

Usage:
1. Start the API server by running this script.
2. Access the API endpoints to manage tickets.

For more details on the API and how to use it, please refer to the API documentation.

Author: AwesomeQA, Oguzhan Yetimoglu
Date: 9 Nov 2023
"""
from app.repositories.ticket_repository import TicketRepository
import uvicorn
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime


app = FastAPI()

TICKET_FILEPATH = "../data/awesome_tickets.json"
ticket_repository = TicketRepository(filepath=TICKET_FILEPATH)


# Enable CORS
origins = ["http://localhost:3000"]  # Add your frontend URL here
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TicketModel(BaseModel):
    """Model for representing a ticket."""
    id: str
    msg_id: str
    status: str
    resolved_by: Optional[str]
    ts_last_status_change: Optional[str]
    timestamp: datetime
    messages: List[Dict[str, str]]


class MessageModel(BaseModel):
    """Model for representing a message."""
    id: str
    channel_id: str
    parent_channel_id: str = None
    community_server_id: str
    timestamp: datetime
    has_attachment: bool
    reference_msg_id: str
    timestamp_insert: datetime
    discussion_id: str
    author_id: str
    content: str
    msg_url: str
    author: dict


@app.get("/healthz")
async def root():
    """Endpoint for checking the health of the API."""
    return "OK"


@app.get("/tickets")
async def get_tickets(
    limit: int = 20,
    ticket_repo: TicketRepository = Depends(lambda: ticket_repository),
):
    """Get a list of tickets.

    Args:
        limit (int): Maximum number of tickets to retrieve.
        ticket_repository (TicketRepository): Dependency to access ticket data.

    Returns:
        List[TicketModel]: A list of tickets with details.
    """
    tickets = ticket_repo.get_tickets()
    return JSONResponse(tickets, status_code=200)


@app.put("/tickets/resolve", response_model=TicketModel)
async def resolve_ticket(
    ticket_id: str = Query(..., description="ID of the ticket to resolve"),
    ticket_repo: TicketRepository = Depends(lambda: ticket_repository),
):
    """Mark a ticket as resolved.

    Args:
        ticket_id (str): ID of the ticket to resolve.
        ticket_repo (TicketRepository): Dependency to access ticket data.

    Returns:
        TicketModel: The resolved ticket.

    Todo:
        * Add "resolved_by"
    """
    ticket = ticket_repo.resolve_ticket(ticket_id)
    if ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return JSONResponse(content=ticket, status_code=200)


@app.delete("/tickets/delete", response_model=TicketModel)
async def remove_ticket(
    ticket_id: str = Query(..., description="ID of the ticket to remove"),
    ticket_repo: TicketRepository = Depends(lambda: ticket_repository),
):
    """Remove a ticket.

    Args:
        ticket_id (str): ID of the ticket to remove.
        ticket_repo (TicketRepository): Dependency to access ticket data.

    Returns:
        TicketModel: The removed ticket.
    """
    ticket = ticket_repo.remove_ticket(ticket_id)
    if ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return JSONResponse(content=ticket, status_code=200)


@app.get("/tickets/get_messages")
async def get_messages(
    ticket_id: str = Query(...,
                           description="ID of the ticket to get its messages"),
    ticket_repo: TicketRepository = Depends(lambda: ticket_repository),
):
    """
    Retrieve messages related to a specific ticket.

    Args:
        - ticket_id (str): The ID of the ticket for which to retrieve messages.
        - ticket_repo (TicketRepository): An instance of the TicketRepository.

    Returns:
        List[Dict]: A List[Dict] containing the messages for the given ticket.
    """
    messages = ticket_repo.get_context_messages(ticket_id)
    return JSONResponse(messages, status_code=200)


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=5001, reload=True)
