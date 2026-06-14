export default function Footer() {
    return (
        <footer className=" text-light py-3"
            style={{
                backgroundColor: '#11998e',
                backgroundImage: 'linear-gradient(to right, #05172c, #012084, #05172c)',
                overflowX: 'hidden'
            }}>
            <div className="container text-center">
                <p className="mb-0">© {new Date().getFullYear()} - 100TETO</p>
            </div>
        </footer>
    );
}