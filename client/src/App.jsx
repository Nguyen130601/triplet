import { Formik, Field, Form} from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import Article from './components/Article';
import React, { useEffect } from 'react';
import { Col, Container, Navbar, NavbarBrand, Row } from 'reactstrap';
import { fetchNodes} from './reducer';
import socket from './socket';

const App =  (props) => {
  const dispatch = useDispatch()

  //const nodes = useSelector(selectAllNode)
  const nodeStatus = useSelector(state => state.state.status)
  const Feed = () => {
    const nodes = useSelector(state => state.state.nodes)
    return <Article id={nodes[0].id} />
  }
  useEffect(() => {
    if (nodeStatus === 'idle') {
      dispatch(fetchNodes()).unwrap()
      .then((originalPromiseResult) => {
        console.log(originalPromiseResult)
      })
    }
  }, [nodeStatus, dispatch])

  return (
    <>
      <Container>
        <Row>
        </Row>
        <Row sm='12'>
          <Col>
          </Col>
          <Col>
            <Navbar color="light" sticky='top'><NavbarBrand>TRIPLET</NavbarBrand></Navbar>
            <Feed />      
            <Formik
              initialValues={{
                message: '',
                file: ''
              }}
              onSubmit={async (initialValues) => {
                initialValues.message = '';
                initialValues.files = [];
              }}
            >
              {(formik) => (
                <Form>
                  <Field name="message" autoComplete="off" />
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
                  <button type="submit">Send</button>
              </Form>
              )}
            </Formik>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </>
  );
};

export default App;

socket.on("users", (users) => {
  users.forEach((user) => {
    user.self = user.userID === socket.id;
    console.log(user);
  })
})