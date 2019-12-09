import React, { Component } from "react";
import axios from "axios";

import PrescriptionListingItem from "../DoctorComponent/PrescriptionListingItem";
import PrescriptionListView from "../DoctorComponent/PrescriptionListView";
import PrescriptionUsageListView from "../DoctorComponent/PrescriptionUsageListView";
import PrescriptionUsageListingItem from "../DoctorComponent/PrescriptionUsageListingItem";

import { DetailsModalView } from "../DoctorComponent/DetailsModalView";
import { UserDetailsComponent } from "../AdminComponent/UserDetailsComponent";
import { UnauthorizedComponent } from "../UnauthorizedComponent";

export default class PatientPrescriptionContainer extends Component {
  constructor(props) {
    super(props);
    this.session = JSON.parse(sessionStorage.getItem("session"));
    this.patientInfo = JSON.parse(sessionStorage.getItem("patientInfo"));
    this.state = {
      prescriptions: null,
      recordDetails: "",
      patient: "",
      notFoundPrescription: <h3>Išrašytų receptų pacientas neturi.</h3>,
      opendRecordRow: "",
      viewContent: "",
      contentType: "record",

      listInfo: "",

      activePage: 0,
      itemsPerPage: 8,
      listLength: "",

      infoDetails: "",
      infoHeader: "",

      prescriptionUsage: "",
      usage: null,
      info: ""
    };
  }

  componentWillMount = () => {
    if (this.session === null || this.session.patient.loggedIn !== true) {
      this.props.router.push("/pacientams");
      return "";
    }
    this.loadRecords(this.state.activePage);
  };
  //load all patient prescriptions and compose to view component
  loadRecords = activePage => {
    axios
      .get(
        "http://localhost:8080/api/patient/" +
          this.session.patient.patientId +
          "/prescription?page=" +
          activePage +
          "&size=" +
          this.state.itemsPerPage
      )
      .then(response => {
        if (response.data.content.length === 0) {
          if (activePage !== 0) {
            this.setState({
              activePage: activePage - 1
            });
            return "";
          }
          this.setState({
            viewContent: this.state.notFoundPrescription
          });
        } else {
          this.setState({
            viewContent: (
              <PrescriptionListView
                prescription={response.data.content.map(
                  this.composePrescription
                )}
              />
            ),
            listInfo: response.data,
            listLength: response.data.content.length
          });
        }
        
      })
      .catch(error => {
        if (
          error.response.data.status > 400 &&
          error.response.data.status < 500
        ) {
          UnauthorizedComponent(
            this.session.user.userName,
            this.session.patient.patientId
          );
          this.props.router.push("/atsijungti");
        } else {
          this.setState({
            viewContent: <h3>Serverio klaida. Bandykite dar kartą vėliau.</h3>
          });
        }
      });
  };

  //compose prescription list to specific listing item (view component)
  composePrescription = (prescription, index) => {
    return (
      <PrescriptionListingItem
        key={index}
        index={index}
        id={prescription.id}
        prescriptionDate={prescription.prescriptionDate}
        expirationDate={prescription.expirationDate}
        ingredientName={prescription.apiTitle}
        useAmount={prescription.useAmount}
        showDetails={this.showPrescriptionDetails}
      />
    );
  };

  //request for single prescription and compose it to view object
  loadSpecificPrescription = prescriptionId => {
    axios
      .get("http://localhost:8080/api/prescription/" + prescriptionId)
      .then(response => {
        this.setState({
          infoDetails: this.composeSpecificPrescription(response.data),
          infoHeader: this.composeSpecificPrescriptionHeader(response.data)
        });
      })
      .catch(error => {
        if (
          error.response.data.status > 400 &&
          error.response.data.status < 500
        ) {
          UnauthorizedComponent(
            this.session.user.userName,
            this.session.patient.patientId
          );
          this.props.router.push("/atsijungti");
        } else {
          this.setState({
            infoDetails: <h3>Serverio klaida. Bandykite dar kartą vėliau.</h3>
          });
        }
      });
  };

  composeSpecificPrescriptionHeader = prescription => {
    return (
      <div>
        <p>Recepto detali informacija</p>
      </div>
    );
  };

  //compose single object to spcific view object
  composeSpecificPrescription = prescription => {
    return (
      <div>
        <p>
          Vaisto veiklioji medžiaga: <strong> {prescription.apiTitle}</strong>
        </p>
        <p>Veikliosios medžiagos kiekis dozėje: {prescription.amount}</p>
        <p>Matavimo vienetai: {prescription.apiUnits}</p>
        <p>Recepto išrašymo data: {prescription.prescriptionDate}</p>
        <p>Receptas galioja iki: {prescription.expirationDate}</p>
        <p>Receptą išrašęs gydytojas: {prescription.doctorFullName} </p>
        <p>Recepto panaudojimų skaičius: {prescription.useAmount}</p>
        <p>Vartojimo aprašymas: {prescription.description}</p>
      </div>
    );
  };

  getPrescriptionUsage = prescriptionId => {
    axios
      .get(
        "http://localhost:8080/api/prescription/" + prescriptionId + "/usages"
      )
      .then(response => {
        if (response.data.length === 0) {
          this.setState({
            prescriptionUsage: (
              <p>
                <b>Receptas nepanaudotas.</b>
              </p>
            )
          });
        } else {
          this.setState({
            prescriptionUsage: (
              <PrescriptionUsageListView
                usage={response.data.map(this.composeUsage)}
              />
            )
          });
        }
      })

      .catch(error => {
        if (
          error.response.data.status > 400 &&
          error.response.data.status < 500
        ) {
          UnauthorizedComponent(
            this.session.user.userName,
            this.session.patient.patientId
          );
          this.props.router.push("/atsijungti");
        } else {
          this.setState({
            prescriptionUsage: (
              <h3>Serverio klaida. Bandykite dar kartą vėliau.</h3>
            )
          });
        }
      });
  };

    composeUsage= (usage, index) =>{
        return (
             <PrescriptionUsageListingItem
                key={index}
                date={usage.usageDate}
                druggistName={usage.druggistFullName}
            />
        )
    }

  //on  record row click show prescription record details
  showPrescriptionDetails = rowId => {
    if (
      document.getElementById("myModal").style.display === "" ||
      document.getElementById("myModal").style.display === "none"
    ) {
      document.getElementById("modalButton").click();
    }

    this.loadSpecificPrescription(rowId);
    this.getPrescriptionUsage(rowId);
  };

  //handle paggination page changes
  handlePageChange = activePage => {
    if (activePage < 1 || this.state.listLength < this.state.itemsPerPage) {
      if (this.state.activePage > activePage && activePage > -1) {
      } else {
        return "";
      }
    }
    //by content type (record/prescription) send request for specific page
    this.loadRecords(activePage);

    //change activePage state to new page number
    this.setState({
      activePage: activePage
    });
  };

  //Show paggination div with props from state
  showPagination = () => {
    return (
      <div className="text-center">
        <div>
          <button
            className="btn btn-default"
            id="previousPage"
            onClick={() => this.handlePageChange(this.state.activePage - 1)}
          >
            ⟨
          </button>
          <button className="btn btn-default">
            {this.state.activePage + 1}
          </button>
          <button
            className="btn btn-default"
            id="nextPage"
            onClick={() => this.handlePageChange(this.state.activePage + 1)}
          >
            ⟩
          </button>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="container">
        <section>
          <UserDetailsComponent
            fullName={this.session.patient.fullName}
            other={
              <button
                onClick={() => this.props.router.goBack()}
                className="btn btn-default navbar-text"
              >
                {" "}
                Atgal{" "}
              </button>
            }
          />
          <div className="panel-group">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3> Receptai</h3>
              </div>
              <div className="panel-body">
                <div className="col-sm-12">
                  {this.state.viewContent}
                  {this.showPagination()}
                  <a
                    href="#"
                    id="modalButton"
                    data-toggle="modal"
                    data-backdrop="false"
                    data-target="#myModal"
                    className="hidden"
                  />
                  <DetailsModalView
                    infoHeader={this.state.infoHeader}
                    infoDetails={this.state.infoDetails}
                    prescriptionUsage={this.state.prescriptionUsage}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
