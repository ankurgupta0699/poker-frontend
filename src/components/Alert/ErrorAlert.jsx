import React, { useEffect, useState } from "react";

import "./Alert.css";


const ErrorAlert = (props) => {
    const { alert } = props;
    return (
        <div className="error-alert">
            {alert}
        </div>
    );
};

export default ErrorAlert;
