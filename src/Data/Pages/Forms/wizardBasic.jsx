import { useFormikContext } from "formik";
import React from "react";
import { ErrorMessage } from "react-hook-form";
import {
  Wizard,
  Progress,
  Pages,
  Page,
  Navigation,
  useDataContext
} from "react-hook-form-wizard";


const onSubmit = ({ dataContext, formContext, wizardContext }) => {
  alert(JSON.stringify(dataContext.state.data));
};

const useFormArgs = {
  mode: "onBlur"
};

export default function App() {

    const { register, errors } = useFormikContext();
  const { state } = useDataContext();

  return (
    <div className="App">
      <Wizard
        useFormArgs={useFormArgs}
        onSubmit={onSubmit}
        enableDevTool={false}
      >
        <Progress />
        <Pages>
          <Page>
            <div>Some important instructions might go here</div>
          </Page>
          <Page>
            {({
              dataContext: { state },
              formContext: { register, errors },
              wizardContext: { activePage }
            }) => {
              return (
                <div>
                  <label htmlFor="firstName">First Name</label>
                  <br />
                  <input
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    ref={register({
                      required: {
                        value: true,
                        message: "Please enter your first name"
                      },
                      minLength: {
                        value: 2,
                        message: "Please enter at least 2 characters"
                      }
                    })}
                    defaultValue={state.data.firstName}
                  />
                  {errors.firstName && <span>{errors.firstName.message}</span>}
                  <br />
                  <label htmlFor="lastName">Last Name</label>
                  <br />
                  <input
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    ref={register({ required: "Last name is required" })}
                    defaultValue={state.data.lastName}
                  />
                  <ErrorMessage name="lastName" errors={errors} />
                </div>
              );
            }}
          </Page>
          <Page>
          <div>
      <label htmlFor="country">Country</label>
      <br />
      <select
        id="country"
        name="country"
        placeholder="Country"
        ref={register({
          required: { value: true, message: "Country is required" }
        })}
        defaultValue={state.data.country}
      >
        <option value="" />
        <option value="United States">United States</option>
        <option value="Some other country">Some other country</option>
      </select>
      <div>
        <ErrorMessage name="country" errors={errors} />
      </div>
    </div>
          </Page>
          <Page>
            {({
              dataContext: {
                state: { data }
              }
            }) => {
              return (
                <div className="review">
                  <div>First name: {data.firstName}</div>
                  <div>Last name: {data.lastName}</div>
                  <div>Country: {data.country}</div>
                </div>
              );
            }}
          </Page>
        </Pages>
        <Navigation />
      </Wizard>
    </div>
  );
}
