import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './ActionDrawer.css';

import _ from 'lodash';

import * as orgActions from '../../../../actions/org';
import * as dropboxActions from '../../../../actions/dropbox';
import { ActionCreators as undoActions } from 'redux-linear-undo';

import ActionButton from './components/ActionButton';

class ActionDrawer extends PureComponent {
  constructor(props) {
    super(props);

    _.bindAll(this, [
      'handleAdvanceTodoClick',
      'handleEditTitleClick',
      'handleEditDescriptionClick',
      'handleAddHeaderClick',
      'handleRemoveHeaderClick',
      'handleMoveHeaderUpClick',
      'handleMoveHeaderDownClick',
      'handleMoveHeaderLeftClick',
      'handleMoveHeaderRightClick',
      'handleMoveSubtreeLeftClick',
      'handleMoveSubtreeRightClick',
      'handleUndoClick',
      'handlePushClick',
      'handlePullClick',
      'handleDoneClick',
    ]);
  }

  componentDidMount() {
    // Send a no-op action to take care of the bug where redux-undo won't allow the first
    // action to be undone.
    this.props.org.noOp();
  }

  handleAdvanceTodoClick() {
    this.props.org.advanceTodoState();
  }

  handleEditTitleClick() {
    this.props.org.enterTitleEditMode();
  }

  handleEditDescriptionClick() {
    this.props.org.enterDescriptionEditMode();
  }

  handleAddHeaderClick() {
    this.props.org.addHeader(this.props.selectedHeaderId);
    this.props.org.selectNextSiblingHeader(this.props.selectedHeaderId);
    this.props.org.enterTitleEditMode();
  }

  handleRemoveHeaderClick() {
    this.props.org.selectNextSiblingHeader(this.props.selectedHeaderId);
    this.props.org.removeHeader(this.props.selectedHeaderId);
  }

  handleMoveHeaderUpClick() {
    this.props.org.moveHeaderUp(this.props.selectedHeaderId);
  }

  handleMoveHeaderDownClick() {
    this.props.org.moveHeaderDown(this.props.selectedHeaderId);
  }

  handleMoveHeaderLeftClick() {
    this.props.org.moveHeaderLeft(this.props.selectedHeaderId);
  }

  handleMoveHeaderRightClick() {
    this.props.org.moveHeaderRight(this.props.selectedHeaderId);
  }

  handleMoveSubtreeLeftClick() {
    this.props.org.moveSubtreeLeft(this.props.selectedHeaderId);
  }

  handleMoveSubtreeRightClick() {
    this.props.org.moveSubtreeRight(this.props.selectedHeaderId);
  }

  handleUndoClick() {
    this.props.undo.undo();
  }

  handlePushClick() {
    this.props.dropbox.pushCurrentFile();
  }

  handlePullClick() {
    // TODO: Check for dirtiness and add a warning message.
    this.props.dropbox.redownloadCurrentFile();
  }

  handleDoneClick() {
    this.props.org.exitTitleEditMode();
    this.props.org.exitDescriptionEditMode();
  }

  render() {
    const { inTitleEditMode, inDescriptionEditMode, historyCount } = this.props;

    return (
      <div className="action-drawer-container nice-scroll">
        {(inTitleEditMode || inDescriptionEditMode) ? (
          <button className="btn action-drawer__done-btn"
                  onClick={this.handleDoneClick}>Done</button>
        ) : (
          <Fragment>
            <ActionButton iconName="check" isDisabled={false} onClick={this.handleAdvanceTodoClick} />
            <ActionButton iconName="pencil-alt" isDisabled={false} onClick={this.handleEditTitleClick} />
            <ActionButton iconName="edit" isDisabled={false} onClick={this.handleEditDescriptionClick} />
            <ActionButton iconName="plus" isDisabled={false} onClick={this.handleAddHeaderClick} />
            <ActionButton iconName="times" isDisabled={false} onClick={this.handleRemoveHeaderClick} />
            <ActionButton iconName="arrow-up" isDisabled={false} onClick={this.handleMoveHeaderUpClick} />
            <ActionButton iconName="arrow-down" isDisabled={false} onClick={this.handleMoveHeaderDownClick} />
            <ActionButton iconName="arrow-left" isDisabled={false} onClick={this.handleMoveHeaderLeftClick} />
            <ActionButton iconName="arrow-right" isDisabled={false} onClick={this.handleMoveHeaderRightClick} />
            <ActionButton iconName="chevron-left" isDisabled={false} onClick={this.handleMoveSubtreeLeftClick} />
            <ActionButton iconName="chevron-right" isDisabled={false} onClick={this.handleMoveSubtreeRightClick} />
            <ActionButton iconName="undo" isDisabled={historyCount <= 1} onClick={this.handleUndoClick} />
            <ActionButton iconName="cloud-upload-alt" isDisabled={false} onClick={this.handlePushClick} />
            <ActionButton iconName="cloud-download-alt" isDisabled={false} onClick={this.handlePullClick} />
          </Fragment>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    inTitleEditMode: state.org.present.get('inTitleEditMode'),
    inDescriptionEditMode: state.org.present.get('inDescriptionEditMode'),
    selectedHeaderId: state.org.present.get('selectedHeaderId'),
    historyCount: state.org.past.length,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    org: bindActionCreators(orgActions, dispatch),
    dropbox: bindActionCreators(dropboxActions, dispatch),
    undo: bindActionCreators(undoActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionDrawer);