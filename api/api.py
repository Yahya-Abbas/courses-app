from flask import Flask, request, session, render_template, redirect, url_for, flash, jsonify
from flask_cors import CORS, cross_origin
from flask_mysqldb import MySQL
import MySQLdb

app = Flask(__name__)
app.secret_key = 'random string'

app.config['MYSQL_USER'] = 'freedbtech_yahya'
app.config['MYSQL_PASSWORD'] = 'password'
app.config['MYSQL_DB'] = 'freedbtech_aucCatalog'
app.config['MYSQL_HOST'] = 'freedb.tech'
#app.config["JSON_AS_ASCII"] = False
#app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
#app.config.update(SESSION_COOKIE_SAMESITE="None", SESSION_COOKIE_SECURE=True)

CORS(app)

mysql = MySQL(app)


@app.route('/api/viewCourseReviews/', methods=['GET', 'POST'])
def index():
    # check for a bad request
    # will probably need to be changed after doing the front to .json
    if not int(request.json['requested']):
        cursor = mysql.connection.cursor()
        departments = cursor.execute("SELECT Dept_Code FROM department")
        departments = list(cursor.fetchall())
        cursor.close()
        # key_list = ['departmentCode']
        # final_departments = [{key_list[0]: department[0]} for department in departments]
        # print(final_departments)
        return jsonify(departments)
    else:
        if (
            not request.json
            or not "dept_code" in request.json
            or not "old_course_code" in request.json
            or not "new_course_code" in request.json
        ):
            return "something missing", 400
    # retirieve the needed data from the request
        dept_code = str(request.json["dept_code"])
        old_course_code = str(request.json["old_course_code"])
        new_course_code = str(request.json["new_course_code"])
        print(dept_code, old_course_code, new_course_code)
        cursor = mysql.connection.cursor()
        retrieved_courses = cursor.execute("SELECT * FROM verified_reviews where Dept_Code = '" + dept_code +
                                           "' and Old_Course_Code = '" + old_course_code + "' and New_Course_Code = '" + new_course_code + "';")
        retrieved_courses = list(cursor.fetchall())
        cursor.close()

        key_list = ['studentID', 'departmentCode', 'oldCourseCode', 'newCourseCode', 'courseName', 'rating', 'review', 'verified']

        final_courses = [{key_list[0]: course[0], key_list[1]: course[1], key_list[2]: course[2], key_list[3]: course[3], key_list[4]: course[4], key_list[5]: course[5], key_list[6]: course[6], key_list[7]: course[7]}
        for course in retrieved_courses]
        
        return jsonify(final_courses)


@app.route('/api/main_menu/', methods=['GET', 'POST'])
def main_menu():
    if "add_review" in request.form:
        return redirect(url_for('add_course_review'))
    elif "course_reviews" in request.form:
        return redirect(url_for('see_course_reviews'))
    elif "add_course_history" in request.form:
        return redirect(url_for('add_course_history'))
    elif "course_info" in request.form:
        return redirect(url_for('course_info'))
    elif "available_courses" in request.form:
        return redirect(url_for('available_courses'))
    elif "view_transcript" in request.form:
        return redirect(url_for('view_transcript'))
    elif "sign_out" in request.form:
        session.pop('session_auc_id', None)
        flash(
            'Signed Out successfuly. If you want to continue using the app, sign in again')
        return redirect(url_for('index'))
    return render_template('main_menu.html')


@app.route('/api/add_course_review/', methods=['GET', 'POST'])
def add_course_review():
    auc_id = session.get('session_auc_id', None)
    error = None

    cursor = mysql.connection.cursor()
    departments = cursor.execute("SELECT Dept_Code FROM department")
    departments = cursor.fetchall()
    cursor.close()

    if "main_menu" in request.form:
        return redirect(url_for('main_menu'))
    elif "sign_out" in request.form:
        session.pop('session_auc_id', None)
        flash(
            'Signed Out successfuly. If you want to continue using the app, sign in again')
        return redirect(url_for('index'))
    elif request.method == 'POST':
        review_details = request.form
        dept_code = review_details['dept_code']
        old_course_code = review_details['old_course_code']
        new_course_code = review_details['new_course_code']
        rating = review_details['rating']
        text_review = review_details['text_review']
        try:
            cursor = mysql.connection.cursor()
            cursor.execute("INSERT INTO reviews values (" + auc_id + ", '" + dept_code + "', '" +
                           old_course_code + "', '" + new_course_code + "', " + rating + ", '" + text_review + "')")
        except MySQLdb._exceptions.IntegrityError:
            error = "Couldn't add Review! Please make sure the Department code and the Course codes you entered are valid!"
        except MySQLdb._exceptions.ProgrammingError:
            error = 'Please make sure to fill out all fields!'
        if error is None:
            mysql.connection.commit()
            cursor.close()
            flash('Course Review Added Successfuly')
            return redirect(url_for('main_menu'))
    return render_template('add_course_review.html', error=error, departments=departments)


@ app.route('/api/see_course_reviews/', methods=['GET', 'POST'])
def see_course_reviews():
    error = None

    cursor = mysql.connection.cursor()
    departments = cursor.execute("SELECT Dept_Code FROM department")
    departments = cursor.fetchall()
    cursor.close()

    if "main_menu" in request.form:
        return redirect(url_for('main_menu'))
    elif "sign_out" in request.form:
        session.pop('session_auc_id', None)
        flash(
            'Signed Out successfuly. If you want to continue using the app, sign in again')
        return redirect(url_for('index'))
    elif "course_reviews" in request.form:
        return redirect(url_for('see_course_reviews'))
    elif request.method == 'POST':
        course_details = request.form
        dept_code = course_details['dept_code']
        old_course_code = course_details['old_course_code']
        new_course_code = course_details['new_course_code']

        cursor = mysql.connection.cursor()
        retrieved_courses = cursor.execute("SELECT * FROM verified_reviews where Dept_Code = '" + dept_code +
                                           "' and Old_Course_Code = '" + old_course_code + "' and New_Course_Code = '" + new_course_code + "';")

        if retrieved_courses > 0:
            flash('Retrieved Reviews Successfully')
            retrieved_courses = cursor.fetchall()
            cursor.close()
            return render_template('course_reviews.html', retrieved_courses=retrieved_courses)

        else:
            error = "Couldn't find a Course matching those details Or there was no Reviews! Please make sure the Department code and the Course codes you entered are valid!\nIf you are sure of the course details, please consider adding a review for this course :)"
    return render_template('see_course_reviews.html', error=error, departments=departments)


@ app.route('/api/add_student_record/', methods=['GET', 'POST'])
def add_student_record():
    error = None

    if "home_page" in request.form:
        return redirect(url_for('index'))
    elif request.method == 'POST':
        new_student_details = request.form
        auc_id = new_student_details['auc_id']
        password = new_student_details['password']
        name = new_student_details['student_name']
        grade = new_student_details['grade']
        gpa = new_student_details['gpa']

        try:
            # print("ID: {}, name: {}, grade: {}, gpa: {}".format(
            #    auc_id, name, grade, gpa))
            cursor = mysql.connection.cursor()
            cursor.execute("INSERT INTO student values (" + auc_id +
                           ", '" + name + "', '" + grade + "', " + gpa + ")")
        except MySQLdb._exceptions.IntegrityError:
            error = "There was some error! Please make sure your details are correct!"
        except MySQLdb._exceptions.ProgrammingError:
            error = 'Please make sure to fill out all fields!'
        if error is None:
            mysql.connection.commit()
            cursor.close()
        try:
            # print("ID: {}, name: {}, grade: {}, gpa: {}".format(
            #    auc_id, name, grade, gpa))
            cursor = mysql.connection.cursor()
            cursor.execute("INSERT INTO users values (" +
                           auc_id + ", '" + password + "')")

        except MySQLdb._exceptions.IntegrityError:
            error = "There was some error! Please make sure your details are correct!"
        except MySQLdb._exceptions.ProgrammingError:
            error = 'Please make sure to fill out all fields!'
        if error is None:
            mysql.connection.commit()
            cursor.close()

            flash('Signed Up Successfully. Please sign in')
            return redirect(url_for('index'))
    return render_template('add_student_record.html', error=error)


@ app.route('/api/add_course_history/', methods=['GET', 'POST'])
def add_course_history():
    auc_id = session.get('session_auc_id', None)
    error = None

    cursor = mysql.connection.cursor()
    departments = cursor.execute("SELECT Dept_Code FROM department")
    departments = cursor.fetchall()
    cursor.close()

    if "main_menu" in request.form:
        return redirect(url_for('main_menu'))
    elif "sign_out" in request.form:
        session.pop('session_auc_id', None)
        flash(
            'Signed Out successfuly. If you want to continue using the app, sign in again')
        return redirect(url_for('index'))
    elif request.method == 'POST':
        course_details = request.form
        dept_code = course_details['dept_code']
        old_course_code = course_details['old_course_code']
        new_course_code = course_details['new_course_code']
        letter_grade = course_details['letter_grade']
        year = course_details['year']
        semester = course_details['semester']
        try:
            # print("ID: {}, name: {}, grade: {}, gpa: {}".format(
            #    auc_id, name, grade, gpa))
            cursor = mysql.connection.cursor()
            cursor.execute("INSERT INTO finished values (" + auc_id + ", '" + dept_code + "', '" + old_course_code +
                           "', '" + new_course_code + "', '" + letter_grade + "', '" + year + "', '" + semester + "')")
        except MySQLdb._exceptions.IntegrityError:
            error = "Couldn't add this Course to your Course history! Please make sure the Department code and the Course codes you entered are valid!"
        except MySQLdb._exceptions.ProgrammingError:
            error = 'Please make sure to fill out all fields!'
        if error is None:
            mysql.connection.commit()
            cursor.close()
            flash('Course was added to your Course history Successfully')
    return render_template('add_course_history.html', error=error, departments=departments)


@ app.route('/api/course_info/', methods=['GET', 'POST'])
def course_info():
    error = None

    cursor = mysql.connection.cursor()
    departments = cursor.execute("SELECT Dept_Code FROM department")
    departments = cursor.fetchall()
    cursor.close()

    if "main_menu" in request.form:
        return redirect(url_for('main_menu'))
    elif "sign_out" in request.form:
        session.pop('session_auc_id', None)
        flash(
            'Signed Out successfuly. If you want to continue using the app, sign in again')
        return redirect(url_for('index'))
    elif "course_info" in request.form:
        return redirect(url_for('course_info'))
    elif request.method == 'POST':
        course_details = request.form
        dept_code = course_details['dept_code']
        old_course_code = course_details['old_course_code']
        new_course_code = course_details['new_course_code']

        cursor = mysql.connection.cursor()
        retrieved_courses = cursor.execute("SELECT * FROM course where Dept_Code = '" + dept_code +
                                           "' and Old_Course_Code = '" + old_course_code + "' and New_Course_Code = '" + new_course_code + "';")

        if retrieved_courses > 0:
            flash('Retrieved Course Successfully')
            retrieved_courses = cursor.fetchall()
            cursor.close()
            return render_template('courses.html', retrieved_courses=retrieved_courses)

        else:
            error = "Couldn't find a Course matching those details! Please make sure the Department code and the Course codes you entered are valid!"
    return render_template('course_info.html', error=error, departments=departments)


@ app.route('/api/available_courses/', methods=['GET', 'POST'])
def available_courses():
    auc_id = session.get('session_auc_id', None)
    error = None

    columns_to_select = "c.Dept_Code, c.Old_Course_Code, c.New_Course_Code, c.Course_Name, c.Credits_Number, c.Description, c.Notes, c.CrossListedDept_Code, c.CrossListed_Old_Course_Code, c.CrossListed_New_Course_Code"

    joined_tables = "course c INNER JOIN coursesemestersoffered s ON c.Dept_Code = s.Dept_Code AND c.Old_Course_Code = s.Old_Course_Code AND c.New_Course_Code = s.New_Course_Code LEFT OUTER JOIN prerequisites p ON c.Dept_Code = p.Dept_Code AND c.Old_Course_Code = p.Old_Course_Code AND c.New_Course_Code = p.New_Course_Code"

    prerequisites_condition = "(Prerequisite_Dept_Code IS NULL OR p.Concurrent = 'Yes' OR (p.Prerequisite_Dept_Code , p.Prerequisite_Old_Course_Code, p.Prerequisite_New_Course_Code) IN (SELECT Dept_Code, Old_Course_Code, New_Course_Code FROM finished WHERE Letter_Grade in ('A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'P', 'CR') AND AUC_ID = " + auc_id + "))"

    finished_courses_condition = "((c.Dept_Code , c.Old_Course_Code, c.New_Course_Code) NOT IN (SELECT Dept_Code, Old_Course_Code, New_Course_Code FROM finished WHERE AUC_ID = " + auc_id + "))"

    if "main_menu" in request.form:
        return redirect(url_for('main_menu'))
    elif "sign_out" in request.form:
        session.pop('session_auc_id', None)
        flash(
            'Signed Out successfuly. If you want to continue using the app, sign in again')
        return redirect(url_for('index'))
    elif "change_semester" in request.form:
        return render_template('semester_available_courses.html')
    elif request.method == 'POST':
        query_details = request.form
        semester_condition = query_details['semester']

        cursor = mysql.connection.cursor()
        retrieved_courses = cursor.execute("SELECT " + columns_to_select + " FROM " + joined_tables + " WHERE s.Semester = '" + semester_condition +
                                           "' AND " + prerequisites_condition + " AND " + finished_courses_condition + " GROUP BY Dept_Code , Old_Course_Code, New_Course_Code;")
        if retrieved_courses > 0:
            flash('Retrieved ' + str(retrieved_courses) + ' Courses Successfully')
            retrieved_courses = cursor.fetchall()
            cursor.close()
            return render_template('available_courses.html', retrieved_courses=retrieved_courses)
        else:
            error = "Couldn't find Courses matching those details! Please make you sure you are choosing a valid semester"
    return render_template('semester_available_courses.html', error=error)


@ app.route('/api/view_transcript/<pk>/', methods=['GET'])
def view_transcript(pk):
    #auc_id = session.get('session_auc_id', None)
    #error = None
    cursor = mysql.connection.cursor()
    retrieved_courses = cursor.execute(
        "SELECT f.Dept_Code, f.Old_Course_Code, f.New_Course_Code, c.Course_Name, f.Letter_Grade, f.Year, f.Semester FROM finished f INNER JOIN course c on f.Dept_Code = c.Dept_Code AND f.Old_Course_Code = c.Old_Course_Code AND f.New_Course_Code = c.New_Course_Code WHERE AUC_ID = " + pk + ";")
    retrieved_courses = list(cursor.fetchall())
    cursor.close()
    
    key_list = ['departmentCode', 'oldCourseCode', 'newCourseCode', 'name', 'letterGrade', 'year', 'semester']

    final_courses = [{key_list[0]: course[0], key_list[1]: course[1], key_list[2]: course[2], key_list[3]: course[3], key_list[4]: course[4], key_list[5]: course[5], key_list[6]: course[6]}
       for course in retrieved_courses]
    return jsonify(final_courses)


if __name__ == "__main__":
    app.run(debug=True)
