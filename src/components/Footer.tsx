import { faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function Footer() {
  return (
    <>
      <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
        <div>
          <div className="grid grid-flow-col gap-4">
            <a
              href="https://www.linkedin.com/in/tim-hrovat-4255b61a6/"
              target="blank"
            >
              <FontAwesomeIcon icon={faLinkedin} size="2x" />
            </a>
            <a href="https://www.instagram.com/hrovat_tim/" target="blank">
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </a>
            <a
              href="mailto:tim.hrovat16@gmail.com"
            >
              <FontAwesomeIcon icon={faEnvelope} size="2x" />
            </a>
          </div>
        </div>
        <div>
          <p>
            Copyright © 2023 - All right reserved by{" "}
            <a
              target="blank"
              href="https://timhrovat.com/"
              className="text-primary pointer"
            >
              Tim Hrovat
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
