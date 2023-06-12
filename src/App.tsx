import { useEffect, useState } from "react";
import Product from "./Components/Product";
import selectArrow from "./svgs/arrow.svg";
import logo from "./svgs/logo.svg";
import "./App.css";
import Form from "./Components/Form";

function App() {
  const url = "https://api2.myauto.ge/ka/products";
  const [data, setData] = useState<any>([]);
  const [period, setPeriod] = useState();
  const [sortOrder, setSortOrder] = useState("0");
  const [query, setQuery] = useState("");
  const [manData, setManData] = useState([]);
  const [catData, setCatData] = useState([]);
  const [filters, setFilters] = useState();
  useEffect(() => {
    fetch("https://static.my.ge/myauto/js/mans.json")
      .then((res) => res.json())
      .then((res) => setManData(res));
    fetch("https://api2.myauto.ge/ka/cats/get")
      .then((res) => res.json())
      .then((res) => setCatData(res.data));
  }, []);
  useEffect(() => {
    fetch(`${url}?${query}&Period=${period}&SortOrder=${sortOrder}`)
      .then((res) => res.json())
      .then((res) => setData([res.data.items, res.data.meta]));
  }, [period, sortOrder, query]);
  function containerReset() {
    Array.from(document.querySelectorAll(".checkbox-container")).map(
      (item: any) => {
        item.style.display = "";
        item.parentNode.children[0].children[1].classList.remove(
          "active-select"
        );
        return item;
      }
    );
    Array.from(document.querySelectorAll(".option-container")).map(
      (item: any) => {
        item.style.display = "";
        item.parentNode.children[0].children[1].classList.remove(
          "active-select"
        );
        return item;
      }
    );
  }
  function handleOptions(e: any) {
    if (e.target.className.includes("select-span")) {
      const container = e.target.parentNode.children[1];
      if (container.style.display === "flex") {
        containerReset();
        container.style.display = "";
      } else {
        containerReset();
        container.style.display = "flex";
        container.parentNode.children[0].children[1].classList.add(
          "active-select"
        );
      }
    } else if (e.target.tagName === "BUTTON") {
      switch (e.target.parentNode.parentNode.id) {
        case "period":
          setPeriod(e.target.value);
          break;
        case "sort-order":
          setSortOrder(e.target.value);
          break;
      }
      containerReset();
      e.target.parentNode.parentNode.children[0].children[0].textContent =
        e.target.textContent;
    }
  }
  return (
    <div
      className="App"
      onClick={(e: any) => {
        const activeContainer: any = Array.from(
          document.querySelectorAll(".checkbox-container")
        )?.find((item: any) => item.style.display === "flex");
        if (
          activeContainer &&
          !activeContainer.contains(e.target) &&
          !e.target.classList.contains("select-span")
        ) {
          containerReset();
        }
      }}
    >
      {data.length === 0 && (
        <div className="loading-screen">
          <div className="load-img"></div>
        </div>
      )}
      <header>
        <img src={logo} alt="Myauto Logo" />
      </header>
      <main>
        <button
          className="filter-btn-mobile"
          onClick={() => {
            const searchForm = document.getElementById("search-form");
            searchForm!.classList.toggle("active-form");
          }}
        >
          <svg
            className="type-icon"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 4H7.5"
              stroke="#272A37"
              strokeWidth="1.4"
              strokeLinecap="round"
            ></path>
            <circle
              cx="10"
              cy="4"
              r="2.3"
              stroke="#272A37"
              strokeWidth="1.4"
            ></circle>
            <path
              d="M12 10L6.5 10"
              stroke="#272A37"
              strokeWidth="1.4"
              strokeLinecap="round"
            ></path>
            <circle
              cx="4"
              cy="10"
              r="2.3"
              transform="rotate(-180 4 10)"
              stroke="#272A37"
              strokeWidth="1.4"
            ></circle>
          </svg>
          ფილტრი
        </button>
        <Form
          setQuery={setQuery}
          catData={catData}
          manData={manData}
          containerReset={containerReset}
        />
        <div className="product-list-container">
          <div className="product-container-top">
            <p className="total">{data[1]?.total} განცხადება</p>
            <div className="extra-param-control" onClick={handleOptions}>
              <div id="period" className="param-type-container">
                <span className="select-span">
                  <p>პერიოდი</p>
                  <img
                    src={selectArrow}
                    alt="Select Arrow"
                    className="select-arrow"
                  />
                </span>
                <div className="checkbox-container">
                  <button value="">პერიოდი</button>
                  <button value="1h">ბოლო 1 საათი</button>
                  <button value="2h">ბოლო 2 საათი</button>
                  <button value="3h">ბოლო 3 საათი</button>
                  <button value="1d">ბოლო 1 დღე</button>
                  <button value="2d">ბოლო 2 დღე</button>
                  <button value="3d">ბოლო 3 დღე</button>
                  <button value="1w">ბოლო 1 კვირა</button>
                  <button value="2w">ბოლო 2 კვირა</button>
                  <button value="3w">ბოლო 3 კვირა</button>
                </div>
              </div>
              <div id="sort-order" className="param-type-container">
                <span className="select-span">
                  <p>თარიღი კლებადი</p>
                  <img
                    src={selectArrow}
                    alt="Select Arrow"
                    className="select-arrow"
                  />
                </span>
                <div className="checkbox-container">
                  <button value="1">თარიღი კლებადი</button>
                  <button value="2">თარიღი ზრდადი</button>
                  <button value="3">ფასი კლებადი</button>
                  <button value="4">ფასი ზრდადი</button>
                  <button value="5">გარბენი კლებადი</button>
                  <button value="6">გარბენი ზრდადი</button>
                </div>
              </div>
            </div>
          </div>
          {data[0]?.map((car: any, i: number) => (
            <Product
              key={i}
              {...car}
              man_name={
                manData.find((item: any) => item.man_id === car.man_id + "")?.[
                  "man_name"
                ]
              }
              category_name={
                catData.find(
                  (item: any) => item.category_id === car.category_id
                )?.["title"]
              }
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
