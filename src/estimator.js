// const data = {
//   region: {
//     name: "Africa",
//     avgAge: 19.7,
//     avgDailyIncomeInUSD: 5,
//     avgDailyIncomePopulation: 0.71
//   },
//   periodType: "days",
//   timeToElapse: 58,
//   reportedCases: 674,
//   population: 66622705,
//   totalHospitalBeds: 1380614
// }

const toDay = (periodType, timeToElapse) => {
  switch (periodType) {
    case 'weeks':
      return timeToElapse * 7;
    case 'months':
      return timeToElapse * 30;
    default:
      return timeToElapse;
  }
};

const covid19ImpactEstimator = (data) => {
  const impact = {};
  const severeImpact = {};

  const {
    reportedCases,
    totalHospitalBeds,
    periodType,
    timeToElapse
  } = data;

  const { avgDailyIncomePopulation, avgDailyIncomeInUSD } = data.region;

  impact.currentlyInfected = reportedCases * 10;
  impact.infectionsByRequestedTime = impact.currentlyInfected * 2
    ** Math.trunc(toDay(periodType, timeToElapse) / 3);
  impact.severeCasesByRequestedTime = Math.trunc(0.15 * impact.infectionsByRequestedTime);
  impact.hospitalBedsByRequestedTime = Math.trunc(0.35 * totalHospitalBeds
    - impact.severeCasesByRequestedTime);
  impact.casesForICUByRequestedTime = Math.trunc(impact.infectionsByRequestedTime * 0.15);
  impact.casesForVentilatorsByRequestedTime = Math.trunc(impact.infectionsByRequestedTime * 0.02);
  impact.dollarsInFlight = Math.trunc((impact.infectionsByRequestedTime
    * avgDailyIncomePopulation * avgDailyIncomeInUSD) / toDay(periodType, timeToElapse));

  severeImpact.currentlyInfected = reportedCases * 50;
  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * 2
    ** Math.trunc(toDay(periodType, timeToElapse) / 3);
  severeImpact.severeCasesByRequestedTime = Math.trunc(0.15
    * severeImpact.infectionsByRequestedTime);
  severeImpact.hospitalBedsByRequestedTime = Math.trunc(0.35 * totalHospitalBeds
    - severeImpact.severeCasesByRequestedTime);
  severeImpact.casesForICUByRequestedTime = Math.trunc(severeImpact.infectionsByRequestedTime
    * 0.15);
  severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(
    severeImpact.infectionsByRequestedTime * 0.02
  );
  severeImpact.dollarsInFlight = Math.trunc((severeImpact.infectionsByRequestedTime
    * avgDailyIncomePopulation * avgDailyIncomeInUSD) / toDay(periodType, timeToElapse));

  return {
    data,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
