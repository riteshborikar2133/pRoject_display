<div className="from">
                <form onSubmit={handlSubmit}>
                    <label htmlFor="title">Title: </label>
                    <input type="text" id='title' onChange={(e) => { setData({ ...data, title: e.target.value }) }} />
                    <br /> <br />
                    <label htmlFor="message">Context: </label>
                    <textarea type="text" id='message' onChange={(e) => { setData({ ...data, message: e.target.value }) }} />
                    <br /> <br />
                    <button type='submit'>Submit</button>
                </form>
            </div>