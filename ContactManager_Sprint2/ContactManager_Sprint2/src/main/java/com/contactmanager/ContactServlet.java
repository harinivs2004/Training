package com.contactmanager;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;

@WebServlet("/ContactServlet")
public class ContactServlet extends HttpServlet {

    private static List<Contact> contactList = new ArrayList<>();

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String action = request.getParameter("action");

        // DELETE
        if ("delete".equals(action)) {
            int index = Integer.parseInt(request.getParameter("id"));
            if (index >= 0 && index < contactList.size()) {
                contactList.remove(index);
                request.setAttribute("message", "Contact deleted successfully!");
            }
        }

        // EDIT
        if ("edit".equals(action)) {
            int index = Integer.parseInt(request.getParameter("id"));
            Contact c = contactList.get(index);

            request.setAttribute("editContact", c);
            request.setAttribute("editIndex", index);

            RequestDispatcher rd = request.getRequestDispatcher("addContact.jsp");
            rd.forward(request, response);
            return;
        }

        request.setAttribute("contacts", contactList);
        RequestDispatcher rd = request.getRequestDispatcher("viewContacts.jsp");
        rd.forward(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String phone = request.getParameter("phone");
        String indexStr = request.getParameter("index");

        // ERROR
        if (name.isEmpty() || email.isEmpty() || phone.isEmpty()) {
            request.setAttribute("error", "All fields are required!");
            RequestDispatcher rd = request.getRequestDispatcher("addContact.jsp");
            rd.forward(request, response);
            return;
        }

        // UPDATE
        if (indexStr != null && !indexStr.isEmpty()) {
            int index = Integer.parseInt(indexStr);
            contactList.set(index, new Contact(name, email, phone));
            request.setAttribute("message", "Contact updated successfully!");
        } else {
            // ADD
            contactList.add(new Contact(name, email, phone));
            request.setAttribute("message", "Contact added successfully!");
        }

        request.setAttribute("contacts", contactList);
        RequestDispatcher rd = request.getRequestDispatcher("viewContacts.jsp");
        rd.forward(request, response);
    }
}
