package com.example.demo.model;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "student_ue",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "ue_id")
    )
    private Set<UE> ues = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "student_courses", joinColumns = @JoinColumn(name = "student_id"))
    @Column(name = "course_title", nullable = false)
    private Set<String> courseTitles = new HashSet<>();

    protected Student() {
        // Required by JPA
    }

    public Student(Long id, User user, Set<UE> ues) {
        this.id = id;
        this.user = user;
        this.ues = ues;
    }

    public Student(User user) {
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<UE> getUes() {
        return ues;
    }

    public void setUes(Set<UE> ues) {
        this.ues = ues;
    }

    public void addUE(UE ue) {
        this.ues.add(ue);
    }

    public void removeUE(UE ue) {
        this.ues.remove(ue);
    }

    public Set<String> getCourseTitles() {
        return courseTitles;
    }

    public void setCourseTitles(Set<String> courseTitles) {
        this.courseTitles = courseTitles;
    }

    public void addCourseTitle(String courseTitle) {
        if (courseTitle != null && !courseTitle.isBlank()) {
            this.courseTitles.add(courseTitle.trim());
        }
    }

    public void removeCourseTitle(String courseTitle) {
        this.courseTitles.remove(courseTitle);
    }
}
