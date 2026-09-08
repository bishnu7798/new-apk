package com.nselectrical.app.data.model

data class DTRRecord(
    val id: String,
    val dtrCode: String,
    val village: String,
    val location: String,
    val capacity: String,
    val feeder: String,
    val block: String,
    val division: String,
    val poleCount: Int = 12,
    val routeLengthMeters: Double = 540.0,
    val isSynced: Boolean = true
)

data class PoleItem(
    val id: String,
    val poleNo: String,
    val typeOfPole: String,
    val spanLengthMeters: Double,
    val staySetCount: Int,
    val earthSpikeCount: Int,
    val suspensionCount: Int,
    val deadEndCount: Int,
    val service1PhCount: Int,
    val service3PhCount: Int
)

val sampleDTRList = mutableListOf(
    DTRRecord(
        id = "1",
        dtrCode = "DTR-RN-01",
        village = "Habibpur",
        location = "Near Primary School",
        capacity = "63 kVA",
        feeder = "11kV Feeder 1",
        block = "Ranaghat-I",
        division = "Nadia Division"
    ),
    DTRRecord(
        id = "2",
        dtrCode = "DTR-RN-02",
        village = "Anulia",
        location = "Market Crossing",
        capacity = "100 kVA",
        feeder = "11kV Feeder 2",
        block = "Ranaghat-I",
        division = "Nadia Division"
    ),
    DTRRecord(
        id = "3",
        dtrCode = "DTR-RN-03",
        village = "Taherpur",
        location = "Substation Link",
        capacity = "25 kVA",
        feeder = "11kV Rural Link",
        block = "Ranaghat-II",
        division = "Nadia Division"
    )
)

val samplePoleList = mutableListOf(
    PoleItem(
        id = "1",
        poleNo = "P-001",
        typeOfPole = "PSC 8m",
        spanLengthMeters = 45.0,
        staySetCount = 1,
        earthSpikeCount = 1,
        suspensionCount = 2,
        deadEndCount = 0,
        service1PhCount = 3,
        service3PhCount = 0
    ),
    PoleItem(
        id = "2",
        poleNo = "P-002",
        typeOfPole = "PSC 9m",
        spanLengthMeters = 52.0,
        staySetCount = 0,
        earthSpikeCount = 1,
        suspensionCount = 1,
        deadEndCount = 1,
        service1PhCount = 2,
        service3PhCount = 1
    ),
    PoleItem(
        id = "3",
        poleNo = "P-003",
        typeOfPole = "PSC 8m",
        spanLengthMeters = 38.0,
        staySetCount = 1,
        earthSpikeCount = 0,
        suspensionCount = 2,
        deadEndCount = 0,
        service1PhCount = 4,
        service3PhCount = 0
    )
)
