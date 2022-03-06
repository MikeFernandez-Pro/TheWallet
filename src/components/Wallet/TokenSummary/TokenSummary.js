import React, { useState } from "react";
import TokenSymbolButton from "../TokenButton/TokenSymbolButton";
import Card from "../../UI/Card/Card";
import ValidationButton from "../../UI/Buttons/ValidationButton";
import CancelationButton from "../../UI/Buttons/CancelationButton";
import ModifyItemModal from "../ModifyItemModal/ModifyItemModal";
import DeleteItemModal from "../DeleteItemModal/DeleteItemModal";
import ItemInfos from "../ItemInfos/ItemInfos";
import ItemHistory from "../ItemHistory/ItemHistory";
import { useDispatch } from "react-redux";
import { ModifyItemIntoWallet, RemoveItemFromWallet } from "../../../store/Wallet/wallet-actions";
import classes from "./TokenSummary.module.css";

const TokenSummary = (props) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isModified, setIsModified] = useState(false);

  const [modifiedToken, setModifiedToken] = useState({
    amountValue: 0,
    isAmountValid: true,
  });

  const dispatch = useDispatch();

  const amountValueEventHandler = (event) => {
    if (!modifiedToken.isAmountValid)
      setModifiedToken((previousState) => ({
        ...previousState,
        isAmountValid: true,
      }));
    setModifiedToken((previousState) => ({
      ...previousState,
      amountValue: event.target.value,
    }));
  };

  const showHistoryHandler = () => {
    setShowHistory(!showHistory);
  };

  const modifyItemHandler = () => {
    setIsModified(true);
  };

  const deleteItemHandler = () => {
    setShowModal(true);
  };

  const confirmDeleteItem = () => {
    dispatch(RemoveItemFromWallet(props.token.key));
    setShowModal(false);
  };

  const amountValidityCheck = () => {
    if (
      modifiedToken.amountValue > 0 &&
      modifiedToken.amountValue < Number.MAX_VALUE
    )
      return true;
    setModifiedToken((previousState) => ({
      ...previousState,
      amountValue: 0,
      isAmountValid: false,
    }));
    return false;
  };

  const constructDate = () => {
    const date = new Date().toDateString();

    return date.substring(date.search(" "));
  };

  const confirmModifyItem = (event) => {
    event.preventDefault();

    if (!amountValidityCheck()) return;

    const newHistory = [...props.token.history];
    newHistory.unshift({
      amount: modifiedToken.amountValue,
      date: constructDate(),
    });

    dispatch(
      ModifyItemIntoWallet(props.token.key, {
        id: props.token.id,
        amount: modifiedToken.amountValue,
        history: newHistory,
      })
    );
    setModifiedToken((previousState) => ({ ...previousState, amountValue: 0 }));
    setIsModified(false);
  };

  const cancelDeleteItem = () => {
    setShowModal(false);
    setIsModified(false);
    setModifiedToken((previousState) => ({
      ...previousState,
      isAmountValid: true,
    }));
  };

  return (
    <React.Fragment>
      {isModified && (
        <ModifyItemModal
          modifiedItem={modifiedToken}
          tokenName={props.token.name}
          confirmModifyItem={confirmModifyItem}
          amountValueEventHandler={amountValueEventHandler}
          cancelModification={cancelDeleteItem}
        />
      )}
      {showModal && (
        <DeleteItemModal
          confirmDeletion={confirmDeleteItem}
          cancelDeletion={cancelDeleteItem}
        />
      )}
      <Card>
        <ul className={classes["token-infos"]}>
          <TokenSymbolButton
            image={props.token.image}
            alt={props.token.name}
            showHistoryHandler={showHistoryHandler}
          />
          <ItemInfos
            item = {props.token}
          />
          <div className={classes["buttons-container"]}>
            <ValidationButton onClick={modifyItemHandler}>
              Modify
            </ValidationButton>
            <CancelationButton onClick={deleteItemHandler}>
              Delete
            </CancelationButton>
          </div>
        </ul>
        {showHistory && <ItemHistory history={props.token.history} />}
      </Card>
    </React.Fragment>
  );
};

export default TokenSummary;
