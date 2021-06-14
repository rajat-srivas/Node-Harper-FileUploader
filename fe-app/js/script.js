const baseUrl = 'http://localhost:3000/api/v1/users/';
const roundName = document.getElementById('roundImageName');
const roundSize = document.getElementById('roundImageSize');
const squareName = document.getElementById('squareImageName');
const squareSize = document.getElementById('squareImageSize');
const userForm = document.getElementById('userDataForm');
const roundImg = document.getElementById('round');
const squareImg = document.getElementById('square');
const buttonHere = document.getElementById('submit');

UpdateDom = (data => {
    console.log(data.processedFiles[0].internalFileName)
    roundImg.src = `../../public/img/users/${data.processedFiles[0].internalFileName}`;
    squareImg.src = `../../public/img/users/${data.processedFiles[1].internalFileName}`;
    roundName.innerText = data.actualFileName;
    squareName.innerText = data.actualFileName;
    roundSize.innerText = data.processedFiles[0].dimension;
    squareSize.innerText = data.processedFiles[1].dimension;
})


userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    UploadImages2();
});

buttonHere.addEventListener('click', (e) => {
    e.preventDefault();
    UploadImages2(e);
});

async function UploadImages2(e) {
    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('photo', document.getElementById('photo').files[0]);
    console.log(document.getElementById('photo').files[0]);
    try {
        const response = await axios.post(`${baseUrl}upload`, formData);
        const id = response.data[0];
        GetUploadImages(id);
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('photo').value = null;
    }
    catch (error) {
        console.error(error);
    }

}

async function GetUploadImages(id) {
    axios.get(`${baseUrl}${id}`)
        .then(res => {
            const userData = res.data[0];
            console.log(userData);
            UpdateDom(userData);
        })
        .catch(error => {
            console.error(error);
        })
}


