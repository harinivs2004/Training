<%@ page import="com.contactmanager.Contact" %>
<!DOCTYPE html>
<html>
<head>
    <title>Add Contact</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<header>
    <h1>Welcome to Contact Manager</h1>
</header>

<h2 style="text-align:center;">Add / Edit Contact</h2>

<%
String error = (String) request.getAttribute("error");
if (error != null) {
%>
<p style="color:red; text-align:center;"><%= error %></p>
<%
}
%>

<div class="container">

<form action="ContactServlet" method="post">

<%
Contact c = (Contact) request.getAttribute("editContact");
Integer index = (Integer) request.getAttribute("editIndex");
%>

<input type="hidden" name="index"
value="<%= index != null ? index : "" %>">

<input type="text" name="name" placeholder="Enter Name"
value="<%= c != null ? c.getName() : "" %>" required>

<input type="email" name="email" placeholder="Enter Email"
value="<%= c != null ? c.getEmail() : "" %>" required>

<input type="text" name="phone" placeholder="Enter Phone"
value="<%= c != null ? c.getPhone() : "" %>" required>

<button type="submit">Save</button>

</form>

</div>

<br>
<a href="index.jsp">Back</a>

</body>
</html>
