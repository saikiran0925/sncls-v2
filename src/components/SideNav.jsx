import './SideNav.css';
import { BsFiletypeJson } from "react-icons/bs";
import { GrNotes } from "react-icons/gr";
import { SiTheboringcompany } from "react-icons/si";
import { MdOutlineCompare } from "react-icons/md";
import { Tooltip } from 'antd';


const SideNav = () => {
  return (
    <div className='side-nav-container'>
      <div className='nav-box'>

        <div className='company-logo'>
          <SiTheboringcompany className='icon' />
        </div>

        <div className='divider'></div>

        <Tooltip placement="left" title="JSONify">
          <div className='nav-item active'>
            <BsFiletypeJson className='icon' />
          </div>
        </Tooltip>

        <Tooltip placement="left" title="Blank Space">
          <div className='nav-item'>
            <GrNotes className='icon' />
          </div>
        </Tooltip>

        <Tooltip placement="left" title="Diff Editor">
          <div className='nav-item'>
            <MdOutlineCompare className='icon' />
          </div>
        </Tooltip>

      </div>
    </div>
  );
}

export default SideNav;
