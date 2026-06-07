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

        request.setAttribute("contacts", contactList);
        RequestDispatcher rd = request.getRequestDispatcher("viewContacts.jsp");
        rd.forward(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String phone = request.getParameter("phone");

        contactList.add(new Contact(name, email, phone));

        response.sendRedirect("ContactServlet");
    }
}