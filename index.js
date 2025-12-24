// ========================= SUCCESS MESSAGE =========================
const succesMessage = document.getElementById("successMessage");
if (succesMessage) succesMessage.style.display = 'none';

// ========================= CREATE DATA =========================
async function createDATA() {
    var studentName = document.getElementById("StudentName").value;
    var studentEmail = document.getElementById("StudentEmail").value;
    var studentCourse = document.getElementById("StudentCourse").value;
    var studentFee = document.getElementById("StudentFee").value;

    if (!studentName || !studentEmail || !studentCourse || !studentFee) {
        succesMessage.style.display = 'block';
        succesMessage.className = "alert alert-danger";
        succesMessage.innerText = "Kindly enter valid values!";
        return;
    }

    const newUser = {
        StudentName: studentName,
        StudentEmail: studentEmail,
        StudentCourse: studentCourse,
        StudentFee: studentFee
    };

    await fetch("https://6924c04382b59600d7213b95.mockapi.io/aptech/studends", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
    });

    succesMessage.style.display = 'block';
    succesMessage.className = "alert alert-success";
    succesMessage.innerText = "Registration Successfully Made!";

    // Clear form
    document.getElementById("StudentName").value = "";
    document.getElementById("StudentEmail").value = "";
    document.getElementById("StudentCourse").value = "";
    document.getElementById("StudentFee").value = "";

    // Refresh table
    fetchUser();
}

// ========================= FETCH USERS =========================
async function fetchUser() {
    var tableBody = document.getElementById("tbleBody");
    if (!tableBody) return;
    tableBody.innerHTML = "";

    const response = await fetch("https://6924c04382b59600d7213b95.mockapi.io/aptech/studends");
    const userDetails = await response.json();

    userDetails.forEach(user => {
        var tableRow = document.createElement("tr");
        tableRow.innerHTML = `
            <th>${user.id}</th>
            <td>${user.StudentName}</td>
            <td>${user.StudentEmail}</td>
            <td>${user.StudentCourse}</td>
            <td>${user.StudentFee}</td>
            <td>
                <a href="update.html?userid=${user.id}" class="btn btn-primary btn-sm me-2">Update</a>
                <button class="btn btn-danger btn-sm" onclick="deleteRecord('${user.id}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(tableRow);
    });
}

// ========================= DELETE RECORD =========================
async function deleteRecord(userId) {

    const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This record will be permanently deleted!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    await fetch(`https://6924c04382b59600d7213b95.mockapi.io/aptech/studends/${userId}`, {
        method: 'DELETE'
    });

    Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Student record deleted successfully.',
        timer: 1500,
        showConfirmButton: false
    });

    fetchUser(); // refresh list
}


// ========================= POPULATE FORM FOR UPDATE =========================
async function populateForm() {
    const searchParams = new URLSearchParams(window.location.search);
    const updateUserID = searchParams.get('userid');
    if (!updateUserID) return;

    const response = await fetch(`https://6924c04382b59600d7213b95.mockapi.io/aptech/studends/${updateUserID}`);
    const user = await response.json();

    document.getElementById('UpdateStudentName').value = user.StudentName;
    document.getElementById('UpdateStudentEmail').value = user.StudentEmail;
    document.getElementById('UpdateStudentCourse').value = user.StudentCourse;
    document.getElementById('UpdateFee').value = user.StudentFee;
}

// ========================= UPDATE RECORD =========================
async function updateRecord() {
    const searchParams = new URLSearchParams(window.location.search);
    const updateUserID = searchParams.get('userid');

    const updatedData = {
        StudentName: document.getElementById('UpdateStudentName').value,
        StudentEmail: document.getElementById('UpdateStudentEmail').value,
        StudentCourse: document.getElementById('UpdateStudentCourse').value,
        StudentFee: document.getElementById('UpdateFee').value
    };

    await fetch(`https://6924c04382b59600d7213b95.mockapi.io/aptech/studends/${updateUserID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    });

    alert("Record Updated Successfully!");
    window.location.href = "studentlist.html";
}

// ========================= INITIAL CALL =========================
populateForm();
