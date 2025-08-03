# Oil_price_Time_series_Analysis
## 📈 Project Overview

This project analyzes historical **Brent crude oil prices** to identify statistically significant change points, especially those linked to major political and economic events. Using **Bayesian inference with PyMC3**, we detect **structural breaks** in the time series and associate them with real-world geopolitical and policy events such as OPEC decisions, international sanctions, and armed conflicts.

The project culminates in an **interactive dashboard** (Flask + React) that visualizes price trends, detected change points, and key event impacts to inform decision-making for **investors**, **policymakers**, and **energy companies**.

---

## 🎯 Business Objective

The key goal is to support stakeholders in understanding how **major external events impact oil price dynamics**, thereby enabling:

- Better **investment strategies**
- Improved **risk mitigation**
- Smarter **policy development**
- Optimized **energy operations planning**

---

## 📊 Dataset Description

- **Source:** Brent oil historical price dataset
- **Period Covered:** May 20, 1987 – September 30, 2022
- **Frequency:** Daily
- **Columns:**
  - `Date`: Date of observation (`dd-MMM-yy` format)
  - `Price`: Brent crude oil price in USD/barrel

---

## 🔧 Tasks Breakdown

### **Task 1: Foundation & Workflow**
- Define analysis pipeline and modeling approach
- Conduct exploratory data analysis (EDA)
- Research and compile 10–15 key global events affecting oil prices
- Prepare time series and compute **log returns** for stationarity
- Document assumptions and limitations

### **Task 2: Change Point Modeling (PyMC3)**
- Build a **Bayesian Change Point Model** using PyMC3
- Estimate:
  - `tau`: Change point (index/date)
  - `mu1`, `mu2`: Mean return before/after change
  - `sigma`: Volatility
- Interpret posterior distributions and visualize model outputs
- Correlate detected change points with real-world events
- Quantify impacts using probabilistic statements

### **Task 3: Interactive Dashboard**
- **Backend (Flask):**
  - Serve model outputs via API
  - Provide endpoints for raw data, change points, and summaries
- **Frontend (React):**
  - Interactive price and return plots
  - Event markers and annotations
  - Filter by date range, zoom into periods of volatility
- **Visual Tools:** Recharts, Chart.js, D3.js
