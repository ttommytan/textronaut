function Button(props){
    return(
        <>
        <input type="file" accept=".db" required className="hidden-btn" id="actual-btn" hidden/>
        <label for="actual-btn" className="actual-btn">Choose File</label>
        </>
    );
}

export default Button;
