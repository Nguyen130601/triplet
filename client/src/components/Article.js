import { Formik, Field, Form } from 'formik'
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle } from 'reactstrap'
import { addNewNode, deleteNode, selectNodeById } from '../reducer';
import { v4 as uuidv4 } from 'uuid'
//import DeletePopover from '../components/DeletePopover'


function displayNotification() {
  if (Notification.permission === 'granted') {
      navigator.serviceWorker.getRegistration().then(function(reg) {
        var options = {
          body: 'Here is a notification body!',
          icon: 'images/example.png',
          vibrate: [100, 50, 100],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
          }
        };
        reg.showNotification('Hello world!', options);
      });
    }
  }


const Article = (props) => {
    const dispatch = useDispatch();
    const node = useSelector(state => selectNodeById(state, props.id))
    const { childIds, title, user, body, votes, id, img, parentId } = node;
    const RenderChilds = () => {
      return childIds.map((childId) =>
        <React.Fragment key={childId}>
          <Article id = {childId} parentId = {id} />
        </React.Fragment>
      )
    }
    const renderImages = (img) => {
      if(img !== '') {
        return <img className="d-block w-100" src={'http://localhost:4000/images/'+img} alt={`picture-`} />
      } 
    }
    if (parentId === undefined || parentId === '') {
      return (
        <>
          <Card>
            <CardBody>
              <CardTitle>{title}</CardTitle>
              <CardSubtitle>{user}</CardSubtitle>
              <CardText>{body}</CardText>
              <CardText>{votes}</CardText>
              {renderImages(img)}
            </CardBody>
            <Formik
                initialValues={{
                  message: '',
                  file: '',
                }}
                onSubmit={(initialValues) => {
                  console.log(initialValues.file)
                  const childId = uuidv4()
                  dispatch(addNewNode({id: childId, body: initialValues.message, parentId: id, user: 'Guest', title: 'Title', img: initialValues.file}))
                  initialValues.message = '';
                  initialValues.file = '';
                }}
              >
                {(formik) =>
                  <Form id="form">
                    <Field id="input" name="message" autoComplete="off" />
                    <input
                          id="file"
                          name="profile"
                          type="file"
                          onChange={async (event) => {
                            const file = event.target.files[0];
                            const data = new FormData()
                            data.append('file', file)
                            await fetch('http://localhost:4000/upload', {
                              method: "POST",
                              body: data
                            }).then(
                              response => response// if the response is a JSON object
                            ).then(
                              success => console.log(success) // Handle the success response object
                            ).catch(
                              error => console.log(error) // Handle the error response object
                            );
                            formik.setFieldValue("file", file.name);
                          }}
                          multiple
                        />
                    <button type='submit'>Send</button>
                  </Form>
                }
            </Formik>
            <RenderChilds/>
          </Card>
        </>
      )
    } else {
      return (
        <>
          <h1>this  is comment</h1>
          <Card>
            <CardBody>
              <Button onClick={()=>dispatch(deleteNode({id, parentId, childIds}))}>X</Button>
              <CardSubtitle>{user}</CardSubtitle>
              <CardText>{body}</CardText>
              <CardText>{votes}</CardText>
              {renderImages(img)}
            </CardBody>
            <Formik
                initialValues={{
                  message: '',
                  file: '',
                }}
                onSubmit={(initialValues) => {
                  console.log(initialValues.file)
                  const childId = uuidv4()
                  dispatch(addNewNode({id: childId, body: initialValues.message, parentId: id, user: 'Guest', title: 'Title', img: initialValues.file}))
                  //dispatch(createNode({body: initialValues.message, parentId: id, user: 'Guest', title: 'Title'}))
                  initialValues.message = '';
                  initialValues.file = '';
                }}
              >
                {(formik) =>
                  <Form id="form">
                    <Field id="input" name="message" autoComplete="off" />
                    <input
                          id="file"
                          name="profile"
                          type="file"
                          onChange={async (event) => {
                            const file = event.target.files[0];
                            const data = new FormData()
                            data.append('file', file)
                            await fetch('http://localhost:4000/upload', {
                              method: "POST",
                              body: data
                            }).then(
                              response => response// if the response is a JSON object
                            ).then(
                              success => console.log(success) // Handle the success response object
                            ).catch(
                              error => console.log(error) // Handle the error response object
                            );
                            formik.setFieldValue("file", file.name);
                          }}
                          multiple
                        />
                    <button type='submit'>Send</button>
                  </Form>
                }
            </Formik>
            <RenderChilds/>
          </Card>
        </>
      )
    }
}
export default Article;