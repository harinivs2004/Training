<!DOCTYPE html>
<html>
<head>
    <title>Add Contact</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<header>
    <h2>Add Contact</h2>
</header>

<div class="container">

<form action="ContactServlet" method="post">
    
    <input type="text" name="name" placeholder="Enter Name" required>
    
    <input type="email" name="email" placeholder="Enter Email" required>
    
    <input type="text" name="phone" placeholder="Enter Phone" required>
    
    <button type="submit">Save</button>

</form>

</div>

</body>
</html>