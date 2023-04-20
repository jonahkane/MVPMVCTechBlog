async function editFormHandler(event) {
    event.preventDefault();

    const title = document.querySelector('input[name="blog-title"]').value;
    const blog_content = document.querySelector('textarea[name="blog-content"]').value.trim();
    const blog_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    const response = await fetch(`/api/blogs/${blog_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            title,
            blog_content
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.edit-blog-form').addEventListener('submit', editFormHandler);