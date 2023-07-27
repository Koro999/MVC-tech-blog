const post_id = document.querySelector("[id=post-id]").value.trim();

const editFormHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector("#post-title").value.trim();
  const content = document.querySelector("#post-content").value.trim();

  //values are printing 
  if (title && content && post_id) {
    console.log(title);
    console.log(content);
    console.log(post_id);
  }

  if (title && content && post_id) {
    const response = await fetch(`/api/edit/${post_id}`, {
      method: "PUT",
      body: JSON.stringify({
        title,
        content,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response)
    if (!response) {
        alert("Failed to update your post");
      }
     // document.location.replace("/dashboard");
  }
  
};

// WHY ONE BUTTON IS SUBMIT AND THE OTHER IS CLICK?
document
  .querySelector(".edit-post-form")
  .addEventListener("submit", editFormHandler);
