import React, { useEffect, useState } from "react";

import "./Alert.css";


const SuccessAlert = (props) => {
    const { alert } = props;
    return (
        <div className="success-alert">
            {alert}
        </div>
    );
};

export default SuccessAlert;
