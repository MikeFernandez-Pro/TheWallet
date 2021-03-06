import { useContext, useEffect } from "react";
import eyeOpenedIcon from "../../../images/eyeOpenedIcon.png"
import eyeClosedIcon from "../../../images/eyeClosedIcon.png"
import eyeOpenedLightIcon from "../../../images/eyeOpenedLightIcon.png"
import eyeClosedLightIcon from "../../../images/eyeClosedLightIcon.png"
import ThemeContext from "../../../store/Theme/theme-context";
import {useSelector,useDispatch } from "react-redux"
import { walletActions } from "../../../store/Wallet/wallet-slice";
import classes from "./ShowHideValueButton.module.css"

const ShowHideValueButton = (props) => {

    const themeCtx = useContext(ThemeContext);
    const dispatch = useDispatch();

    const showValue = useSelector( (state) => state.wallet.showValue);

    const showValueHandler = () => {
        dispatch(walletActions.showOrHideWallet())
    };

    const showHideClass = showValue ? classes["opened-img"] : classes["closed-img"]
    const openedEyeIcon = themeCtx.lightTheme ? eyeOpenedIcon : eyeOpenedLightIcon;
    const closedEyeIcon = themeCtx.lightTheme ? eyeClosedIcon : eyeClosedLightIcon;

    return (
            <img className={`${showHideClass} ${!themeCtx.lightTheme ? classes["dark-mode"] : ""}`}
                src={showValue? openedEyeIcon : closedEyeIcon}
                alt="Eye Icon" onClick={showValueHandler}
            />
    );
};

export default ShowHideValueButton;