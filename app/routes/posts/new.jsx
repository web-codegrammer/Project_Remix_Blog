import {Link, redirect, useActionData, json } from 'remix'
import {db} from '~/utils/db.server'
import {getUser} from '~/utils/session.server'

function validateTitle(title) {
    if(typeof title !== 'string' || title.length < 3) {
        return 'Title should be at least 3 characters long'
    }
}

function validateBody(body) {
    if(typeof body !== 'string' || body.length < 10) {
        return 'Body should be at least 10 characters long'
    }
}

function badRequest(data) {
    return json(data, {status: 400})
}

export const action = async ({request}) => {
    const form = await request.formData()
    const title = form.get('title')
    const body = form.get('body')
    const user = await getUser(request)

    const fields = { title, body }

    const fieldErrors = {
        title: validateTitle(title),
        body: validateBody(body)
    }

    if(Object.values(fieldErrors).some(Boolean)) {
        console.log(fieldErrors);
        return badRequest({fieldErrors, fields})
    }

    const post = await db.post.create({ data: {...fields, userId:
    user.id} })

     return redirect(`/posts/${post.id}`)
}

function NewPost() {
    const actionData = useActionData()

    return (
        <>
        <div className="page-header">
        <h1>New Post</h1>
        <Link to ='/posts' className='btn btn-reverse'>
            Back
        </Link>
        </div>

        <div className="page-content">
            <form method='POST'>
                <div className="form-control">
                    <label htmlFor='title'>Title</label>
                    <input 
                    type="text" 
                    name='title' 
                    id='title' 
                    defaultValue={actionData?.fields?.title}
                    />
                    <div className="error">
                        <p>{actionData?.fieldErrors?.title && (actionData?.fieldErrors?.title)}</p>
                    </div>
                </div>
                <div className="form-control">
                    <label htmlFor="body">Post Body</label>
                    <textarea 
                    name='body' 
                    id='body' 
                    defaultValue={actionData?.fields?.body}
                    />
                    <div className="error">
                        <p>{actionData?.fieldErrors?.body && (actionData?.fieldErrors?.body)}</p>
                    </div>
                </div>
                <button type='submit' className="btn btn-block">
                        Add Post
        </button>
            </form>
        </div>
        </>
    )
}


export default NewPost
