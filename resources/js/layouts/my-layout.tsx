export default function MyLayout({ children } : any) {
    return (
        <>           

            {/* Navigation*/}
            <nav
                className="navbar navbar-expand-lg navbar-light fixed-top shadow-sm"
                id="mainNav"
            >
                <div className="container px-5">
                    <a className="navbar-brand fw-bold" href="#page-top">
                        โครงการ Happy Health Happy Heart
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarResponsive"
                        aria-controls="navbarResponsive"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        Menu
                        <i className="bi-list" />
                    </button>
                    <div
                        className="collapse navbar-collapse"
                        id="navbarResponsive"
                    >
                        <ul className="navbar-nav ms-auto me-4 my-3 my-lg-0">
                            <li className="nav-item">
                                <a
                                    className="nav-link me-lg-3"
                                    href="#features"
                                >
                                    Features2
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link me-lg-3"
                                    href="#download"
                                >
                                    Download
                                </a>
                            </li>
                        </ul>
                        <button
                            className="btn btn-primary rounded-pill px-3 mb-2 mb-lg-0"
                            data-bs-toggle="modal"
                            data-bs-target="#feedbackModal"
                        >
                            <span className="d-flex align-items-center">
                                <i className="bi-chat-text-fill me-2" />
                                <span className="small">Send Feedback</span>
                            </span>
                        </button>
                    </div>
                </div>
            </nav>

            <main>{children}</main>

            {/* Footer*/}
            <footer className="bg-black text-center py-5">
                <div className="container px-5">
                    <div className="text-white-50 small">
                        <div className="mb-2">
                            © Your Website 2023. All Rights Reserved.
                        </div>
                        <a href="#!">Privacy</a>
                        <span className="mx-1">·</span>
                        <a href="#!">Terms</a>
                        <span className="mx-1">·</span>
                        <a href="#!">FAQ</a>
                    </div>
                </div>
            </footer>

        </>
    );
}
