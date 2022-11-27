import { URL_PREFIX_PATH } from 'configs/AppConfig';
import React, { useMemo } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Conversation from './Conversation';

const ConversationEmpty = () => (
  <div className="chat-content">
    <div className="text-left">
      <h3>General Instructions</h3>
      <div>
        <hr />
        <div style={{ maxWidth: '700px' }}>
          <p>
            &diams; To view an existing conversation with a patient please click
            on the name of the patient from list of all patients interacted with
            Asa on the left - if any
          </p>
          <p>
            &diams; To communicate with a patient, Asa AI must be paused (using
            the 'Pause Asa' checkbox inside the conversation with patient
            section), and the patient must have communicated with us within 24h.
            <br />
            <b>
              <small>
                <i>
                  Once done, please do not forget to unpause Asa using the
                  'Unpause Asa' checkbox.
                </i>
              </small>
            </b>
          </p>
          <p>
            &diams; When a patient requested to speak to a human, their name in
            the conversation sections will be flashing in red, and a new checkbox
            called 'Contacted patient' will appear in the conversation with
            patient section.
            <br />
            <b>
              <small>
                <i>
                  Once the case has been resolved please mark the conversation
                  using the 'Contacted patient' checkbox.
                </i>
              </small>
            </b>
          </p>
          <p>
            &diams; When Asa AI detects that a patient is in emergency situation,
            their name in the conversation sections will be flashing in red as
            well along with the sign:{' '}
            <span style={{ color: '#cc0000' }}>&#9888;</span>, and a new checkbox
            called 'Emergency resolved' will appear in the conversation with
            patient section.
            <br />
            <b>
              <small>
                <i>
                  Once the case has been resolved please mark the conversation
                  using the 'Emergency resolved' checkbox
                </i>
              </small>
            </b>
          </p>
        </div>
      </div>
      {/* <img
        src={`${URL_PREFIX_PATH}/img/others/img-11.png`}
        alt="Start a Conversation"
      />
      <h1 className="font-weight-light">Start a conversation</h1> */}
    </div>
  </div>
);

const ChatContent = () => {
  const match = useRouteMatch();
  return useMemo(
    () => (
      <Switch>
        <Route path={`${match.url}/:id`} component={Conversation} />
        <Route path={`${match.url}`} component={ConversationEmpty} />
      </Switch>
    ),
    [match]
  );
};

export default ChatContent;
