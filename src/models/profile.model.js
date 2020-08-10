module.exports = (mongoose) => {
    let schema = mongoose.Schema(
        {
            fullname: String,
            email: String,
            private: Boolean,
            password: String,
        },
        { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Profile = mongoose.model("Profile", schema);
    return Profile;
};
