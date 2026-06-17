<%@ page import="java.util.*, com.contactmanager.Contact" %>

<!DOCTYPE html>
<html>
<head>
<title>View Contacts</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<h2>All Contacts</h2>

<%
String msg = (String) request.getAttribute("message");
if (msg != null) {
%>
<p style="color:green;"><%= msg %></p>
<%
}
%>

<table border="1">
<tr>
<th>Name</th>
<th>Email</th>
<th>Phone</th>
<th>Actions</th>
</tr>

<%
List<Contact> contacts = (List<Contact>) request.getAttribute("contacts");

if (contacts != null) {
    for (int i = 0; i < contacts.size(); i++) {
        Contact c = contacts.get(i);
%>

<tr>
<td><%= c.getName() %></td>
<td><%= c.getEmail() %></td>
<td><%= c.getPhone() %></td>

<td>
    <a href="ContactServlet?action=edit&id=<%= i %>">Edit</a> |
    <a href="ContactServlet?action=delete&id=<%= i %>">Delete</a>
</td>
</tr>

<%
    }
}
%>

</table>

<br>
<a href="addContact.jsp">Add New</a>

</body>
</html>