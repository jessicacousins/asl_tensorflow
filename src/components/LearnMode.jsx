import { useMemo, useState } from "react";
import "./LearnMode.css";
import { SIGN_LIBRARY } from "../lib/signLibrary.js";
import SignIcon from "./SignIcon.jsx";

const CATEGORIES = ["All", "Phrase", "Letter"];

export default function LearnMode() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SIGN_LIBRARY.filter((s) => {
      if (filter !== "All" && s.category !== filter) return false;
      if (!q) return true;
      return (
        s.sign.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    });
  }, [filter, query]);

  return (
    <div className="panel learn-panel">
      <div className="panel-head">
        <div>
          <h2>Sign library</h2>
          <p className="panel-sub">
            Every sign JC-Signs can recognise, with a description of the
            handshape. Use this to learn what to try in Practice or Translate.
          </p>
        </div>
      </div>

      <div className="learn-toolbar">
        <input
          type="search"
          className="search-input"
          placeholder="Search signs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="cat-pills">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`cat-pill ${filter === c ? "is-active" : ""}`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <ul className="sign-grid">
        {items.map((s) => (
          <li key={s.sign} className="sign-card fade-in">
            <div className="sign-card-head">
              <span className="sign-card-icon" aria-hidden="true">
                <SignIcon sign={s.sign} size="md" />
              </span>
              <div>
                <h3 className="sign-card-name">{s.sign}</h3>
                <span className="sign-card-cat">{s.category}</span>
              </div>
            </div>
            <p className="sign-card-desc">{s.description}</p>
            <p className="sign-card-example">{s.example}</p>
          </li>
        ))}
        {!items.length && (
          <li className="sign-empty">No signs match that filter.</li>
        )}
      </ul>

      <div className="learn-footnote">
        Face and body tracking are used for location-based signs. J, Z, Yes,
        Home, Please, and Thank You use short motion checks.
      </div>
    </div>
  );
}
