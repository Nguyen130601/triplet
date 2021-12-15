import { useDispatch, useSelector } from 'react-redux';
import Article from './components/Article';
import React, { useEffect } from 'react';
import { Col, Container, Navbar, NavbarBrand, Row } from 'reactstrap';
import { fetchNodes} from './reducer';
import {
  BrowserRouter ,
  Routes,
  Route,
  Link
} from 'react-router-dom'
import { UsersList } from './features/users/UsersList'
import socket from './socket';

const App =  () => {
  const dispatch = useDispatch()
  const nodeStatus = useSelector(state => state.state.status)

  useEffect(() => {
    function displayNotification(msg) {
      if (Notification.permission === 'granted') {
        navigator.serviceWorker.getRegistration().then(function(reg) {
          var options = {
            body: 'Here is a notification body!' + JSON.stringify(msg),
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
    socket.on('notification', (msg) => {
      displayNotification(msg)
    })
    if (nodeStatus === 'idle') {
      dispatch(fetchNodes())
    }
  }, [nodeStatus, dispatch])

  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<UsersList />} />
          </Routes>
      </BrowserRouter>
    </>
  );
};

const Home = () => {
  const Feed = () => {
    const nodes = useSelector(state => state.state.nodes)
    return <Article id={nodes[0].id} />
  }
  return (
    <React.Fragment>
      <Container>
        <Row>
          <Navbar color="light" sticky='top'>
            <NavbarBrand>TRIPLET</NavbarBrand>
            <Link to="/">Home</Link>
            <Link to="/users">Users</Link>
          </Navbar>
        </Row>
        <Row sm='12'>
          <Col></Col>
          <Col><Feed /></Col>
          <Col></Col>
        </Row>
      </Container>
    </React.Fragment>
  )
}



export default App;