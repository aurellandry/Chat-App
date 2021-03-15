import React from 'react';
import './ToolbarButton.css';

export default function ToolbarButton(props) {
    const { icon } = props;
    return (
        <button type={props.type ?? ""} ><i className={`iconify toolbar-button`} data-icon={icon} /></button>
    );
}