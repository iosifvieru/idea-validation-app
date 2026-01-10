export async function graphqlFetch(query, variables = {}, token = null) {

    const headers = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    console.log(token);

    const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers,
        body: JSON.stringify({ query, variables }),
    });
    const body = await response.json();
    console.log(body);
    if (body.errors) {
        throw new Error(body.errors.map((e) => e.message).join(", "));
    }
    return body.data;
}