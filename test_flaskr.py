import os
import tempfile
import statistics
import pytest


# @pytest.fixture
# def client():
#     flaskr.app.config['TESTING'] = True

#     with flaskr.app.test_client() as client:
#         with flaskr.app.app_context():
#             print('would init db')

#         yield client


# def test_empty_db(client):
#     # start with a black database. we are using a dictionary as a database
#     # May need to set up a sqlite3 db if it doesn't work in tests or when deployed
#     rv = client.get('/display')
#     assert (rv == {}), "initial database is not empty"


def test_log():
    fs_list = []
    ss_list = []
    se_list = []
    failed = 0

    c_r = 0
    k_s = 1e-6
    gamma = 18
    gamma_w = 9.81
    slope = 45
    q = 0
    H_wt = 5
    z = 3

    import csv
    from api.FS import FSUnsat

    with open('./src/resources/testing/lognormal.csv') as f:
        reader = csv.reader(f, delimiter='\t')
        i = 0
        for row in reader:
            # print("\nRow Number: {}".format(i))
            # get random variables
            c = row[4]
            phi = row[5]
            a = row[6]
            n = row[7]

            # get expected answers
            expected = {}
            expected['matric'] = float(row[1])
            expected['ss'] = float(row[0])
            expected['Se'] = float(row[3])
            expected['fs'] = float(row[8])

            # print("Expected results: {}".format(expected))

            fs = FSUnsat(c, c_r, phi, k_s, a, n, gamma,
                         gamma_w, slope,  q, H_wt, z)

            fs_list.append(fs.fs)
            ss_list.append(fs.ss)
            se_list.append(fs.Se)

            # print("Matric Suction =  {}".format(
            #     round(fs.matric_suction, 2)))
            # print("Suction Stress = {}".format(round(fs.ss, 3)))
            # print("Se = {}".format(round(fs.Se, 3)))
            # print("Factor of Safety =  {}".format(round(fs.fs, 3)))

            assert(round(fs.matric_suction, 2) == expected['matric'])
            assert(round(fs.ss, 1) == round(expected['ss'], 1))
            assert(round(fs.Se, 2) == round(expected['Se'], 2))
            assert(round(fs.fs, 2) == round(expected['fs'], 2))

            if fs.fs < 1:
                failed += 1

            i += 1
    print(statistics.mean(ss_list))
    print(statistics.mean(se_list))
    print(statistics.mean(fs_list))

    assert((failed / 1000) == 0.968), "incorrect probability of failure"
    assert(round(statistics.mean(ss_list), 2) == -0.32)
    assert(round(statistics.mean(se_list), 2) == 0.01), "incorrect se average"


def Average(l):
    return sum(l) / len(l)

# def test_fs_sat():
#     c = 0
#     c_r = 0
#     phi = 0
#     gamma = 0
#     gamma_w = 0
#     slope = 0
#     H_wt = 5
#     z = 1

#     from api.FS import FSSat

#     """ FSSat(c, c_r, phi, gamma, gamma_w, slope, H_wt, z)  """
#     fs = FSSat(c, c_r, phi, gamma, gamma_w, slope, H_wt, z)

#     assert (fs == 0)

if __name__ == "__main__":
    test_log()