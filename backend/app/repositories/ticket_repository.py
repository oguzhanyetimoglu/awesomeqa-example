import json
from typing import Optional, List, Dict
from datetime import datetime


class TicketRepository:
    """
    A repository for managing tickets data.

    Args:
        filepath (str): The path to the JSON file containing ticket data.

    Attributes:
        data (dict): The parsed JSON data containing ticket information.

    Methods:
        - get_tickets(limit: Optional[int] = None): Retrieve a list of tickets.
        - resolve_ticket(ticket_id: str): Mark a ticket as resolved.
        - remove_ticket(ticket_id: str): Remove a ticket from the repository.
    """

    def __init__(self, filepath: str):
        """
        Initialize the TicketRepository with the path to the JSON file.

        Args:
            filepath (str): The path to the JSON file containing ticket data.
        """
        with open(filepath) as json_file:
            self.data = json.load(json_file)

    def get_message(self, ticket_id: str) -> Dict:
        """
        Retrieve a message for a given ticket ID.

        Parameters:
            - msg_id (str): The ID of the ticket.

        Returns:
            Dict: A message dictionary.
        """
        # Find the ticket by ID
        tickets = self.data["tickets"]
        messages = self.data["messages"]
        for ticket in tickets:
            if ticket["id"] == ticket_id:
                for message in messages:
                    if message["id"] == ticket["msg_id"]:
                        return message
        return None

    def get_tickets(self, limit: Optional[int] = None):
        """
        Retrieve a list of tickets with associated messages.

        Args:
            limit (int, optional): The maximum number of tickets to retrieve. Defaults to None.

        Returns:
            list[dict]: A list of ticket dictionaries with associated messages.
        """
        tickets = self.data["tickets"][:limit]
        for ticket in tickets:
            ticket["msg"] = self.get_message(ticket["id"])
        return tickets

    def resolve_ticket(self, ticket_id: str):
        """
        Mark a ticket as resolved.

        Args:
            ticket_id (str): The ID of the ticket to resolve.

        Returns:
            dict: The resolved ticket dictionary, or None if the ticket is not found.
        """
        tickets = self.data["tickets"]
        for ticket in tickets:
            if ticket["id"] == ticket_id:
                if ticket["status"] == "open":
                    ticket["status"] = "resolved"
                    # Replace with the actual moderator's ID
                    ticket["resolved_by"] = "moderator_id"
                    ticket["ts_last_status_change"] = datetime.now().strftime(
                        "%Y-%m-%d %H:%M:%S.%f")
                    return ticket
        return None

    def remove_ticket(self, ticket_id: str):
        """
        Remove a ticket from the repository.

        Args:
            ticket_id (str): The ID of the ticket to remove.

        Returns:
            dict: The removed ticket dictionary, or None if the ticket is not found.
        """
        tickets = self.data["tickets"]
        for ticket in tickets:
            if ticket["id"] == ticket_id:
                tickets.remove(ticket)
                return ticket
        return None

    def get_context_messages(self, ticket_id: str) -> List[Dict]:
        """
        Retrieve messages for a given ticket ID.

        Parameters:
            - ticket_id (str): The ID of the ticket.

        Returns:
            List[Dict]: A list of message dictionaries.
        """
        # Find the ticket by ID
        tickets = self.data["tickets"]
        for ticket in tickets:
            if ticket["id"] == ticket_id:

                # Fetch related message IDs from the ticket's context_messages
                message_ids = ticket["context_messages"]

                # Fetch details for each related message
                messages = [
                    message
                    for message in self.data["messages"]
                    if message["id"] in message_ids
                ]

        return messages
