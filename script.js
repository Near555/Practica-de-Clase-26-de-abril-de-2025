document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const userTableBody = document.getElementById('userTableBody');
    let userData = [];
    let allUsersData = []; 
     async function fetchUserData() {
        try {
            const response = await fetch('usuarios.json');
            const data = await response.json();
            userData = data.usuarios;
            allUsersData = [...userData]; 
            renderTable(userData);
        } catch (error) {
            console.error('Error al cargar los datos:', error);
            userTableBody.innerHTML = '<tr><td colspan="9">Error al cargar los datos.</td></tr>';
        }
    }
    function renderTable(users) {
        userTableBody.innerHTML = '';
        users.forEach(user => {
            const row = userTableBody.insertRow();
            row.insertCell().textContent = user.id;
            row.insertCell().textContent = user.nombre;
            row.insertCell().textContent = user.email;
            row.insertCell().textContent = user.telefono;
            row.insertCell().textContent = `${user.direccion.calle} ${user.direccion.numero}, ${user.direccion.ciudad} (${user.direccion.codigoPostal})`;
            row.insertCell().textContent = user.fechaRegistro;

            const estadoCell = row.insertCell();
            estadoCell.textContent = user.activo ? 'Activo' : 'Inactivo';

            const botonesCell = row.insertCell();
            const activarButton = document.createElement('button');
            activarButton.textContent = 'Activar';
            activarButton.classList.add('activar-button');
            activarButton.addEventListener('click', () => setActivo(user.id, true));
            botonesCell.appendChild(activarButton);

            const desactivarButton = document.createElement('button');
            desactivarButton.textContent = 'Desactivar';
            desactivarButton.classList.add('desactivar-button');
            desactivarButton.addEventListener('click', () => setActivo(user.id, false));
            botonesCell.appendChild(desactivarButton);

            row.insertCell().textContent = user.roles.join(', ');
        });
    }
    function setActivo(userId, activo) {
        const userIndex = allUsersData.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
            allUsersData[userIndex].activo = activo;
            renderTable(filterUsers(searchInput.value)); 
            userData = [...allUsersData.filter(user =>
                user.nombre.toLowerCase().includes(searchInput.value.toLowerCase()) ||
                user.email.toLowerCase().includes(searchInput.value.toLowerCase()) ||
                (user.activo ? 'activo' : 'inactivo').includes(searchInput.value.toLowerCase())
            )];
        }
    }
    function filterUsers(searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return allUsersData.filter(user =>
            user.nombre.toLowerCase().includes(lowerSearchTerm) ||
            user.email.toLowerCase().includes(lowerSearchTerm) ||
            (user.activo ? 'activo' : 'inactivo').includes(lowerSearchTerm)
        );
    }
    searchInput.addEventListener('input', () => {
        renderTable(filterUsers(searchInput.value));
    });
    fetchUserData();
});