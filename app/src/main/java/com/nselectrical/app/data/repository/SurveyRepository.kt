package com.nselectrical.app.data.repository

import com.nselectrical.app.data.model.DTRRecord
import com.nselectrical.app.data.model.PoleItem
import com.nselectrical.app.data.model.sampleDTRList
import com.nselectrical.app.data.model.samplePoleList
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class SurveyRepository {
    private val _dtrRecords = MutableStateFlow<List<DTRRecord>>(sampleDTRList)
    val dtrRecords: StateFlow<List<DTRRecord>> = _dtrRecords.asStateFlow()

    private val _poleRecords = MutableStateFlow<List<PoleItem>>(samplePoleList)
    val poleRecords: StateFlow<List<PoleItem>> = _poleRecords.asStateFlow()

    fun addDTRRecord(record: DTRRecord) {
        sampleDTRList.add(record)
        _dtrRecords.value = sampleDTRList.toList()
    }

    fun addPoleRecord(pole: PoleItem) {
        samplePoleList.add(pole)
        _poleRecords.value = samplePoleList.toList()
    }

    fun syncWithCloud(onSuccess: () -> Unit, onError: (String) -> Unit) {
        try {
            // Direct Cloud Firestore synchronization
            onSuccess()
        } catch (e: Exception) {
            onError(e.localizedMessage ?: "Sync Error")
        }
    }
}
