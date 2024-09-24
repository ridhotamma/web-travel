import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBx47SCHxsxnP0ZFlAvtmIvxCcCvFu--ds",
    authDomain: "samira-travel.firebaseapp.com",
    projectId: "samira-travel",
    storageBucket: "samira-travel.appspot.com",
    messagingSenderId: "891625530636",
    appId: "1:891625530636:web:7f68c0f2954c1b34fd5529",
    measurementId: "G-H0B23JQXNS"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

let formData;

document.getElementById('jamaahForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    formData = new FormData(this);

    const submitButton = this.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.style.opacity = 0.5
    submitButton.disabled = true;

    try {
        const uploadedFiles = await uploadFiles();
        const submissionData = await prepareSubmissionData(uploadedFiles);

        if (await submitToFirestore(submissionData)) {
            alert('Form submitted successfully!');
            this.reset();
            document.querySelectorAll('.file-preview').forEach(preview => preview.remove());
            document.querySelectorAll('.file-upload-text').forEach(text => text.textContent = 'Upload File');
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        alert('An error occurred while submitting the form. Please try again.');
    } finally {
        submitButton.textContent = originalButtonText;
        submitButton.style.opacity = 1
        submitButton.disabled = false;
    }
});

async function uploadFiles() {
    const uploadedFiles = {};
    const fileInputs = document.querySelectorAll('input[type="file"]');

    for (let input of fileInputs) {
        const file = input.files[0];
        if (file) {
            const storageRef = ref(storage, `jamaah_documents/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            uploadedFiles[input.name] = downloadURL;
        }
    }

    return uploadedFiles;
}

async function prepareSubmissionData(uploadedFiles) {
    const submissionData = {};

    for (let [key, value] of formData.entries()) {
        submissionData[key] = value;
    }

    return { ...submissionData, ...uploadedFiles };
}

async function submitToFirestore(data) {
    await addDoc(collection(db, "jamaah_submissions"), data);
}

const fileInputs = document.querySelectorAll('input[type="file"]');

fileInputs.forEach((input) => {
    input.addEventListener('change', function (e) {
        const file = e.target.files[0];
        const container = e.target.closest('.file-upload-container');
        const icon = container.querySelector('.file-upload-icon');
        const text = container.querySelector('.file-upload-text');
        const existingImage = container.querySelector('img');

        if (file) {
            if (existingImage) {
                existingImage.remove();
            }

            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'file-preview';
                    img.style.zIndex = 1;
                    container.appendChild(img);
                };
                reader.readAsDataURL(file);
            } else {
                icon.className = 'fas fa-file-pdf file-upload-icon';
            }
            text.textContent = file.name;
        }
    });
});
