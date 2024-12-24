import './SideNav.css';

const SideNav = () => {
  return (
    <div className='side-nav-container'>
     <div className='nav-box'>
       <span>Inbox</span>
       <span>12</span>
     </div>
     <div className='nav-box'>
       <span>Trash</span>
       <span>12</span>
     </div>
     <div className='nav-box'>
       <span>Sent</span>
       <span>12</span>
     </div>
    </div>
  );
}

export default SideNav;