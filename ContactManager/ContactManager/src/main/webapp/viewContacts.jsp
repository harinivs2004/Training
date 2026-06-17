<%@ page import="java.util.*, com.contactmanager.Contact" %>

<!DOCTYPE html>
<html>
<head>
    <title>View Contacts</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<header>
    <h2>All Contacts</h2>
</header>

<div class="container">

<table border="1">
<tr>
    <th>Name</th>
    <th>Email</th>
    <th>Phone</th>
</tr>

<%
List<Contact> contacts = (List<Contact>) request.getAttribute("contacts");

if (contacts != null) {
    for (Contact c : contacts) {
%>

<tr>
    <td><%= c.getName() %></td>
    <td><%= c.getEmail() %></td>
    <td><%= c.getPhone() %></td>
</tr>

<%
    }
}
%>

</table>

<br>
<a href="index.jsp" class="btn">Back</a>

</div>

</body>
</html>
